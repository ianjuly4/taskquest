from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, Date, Task
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta

@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

class Tasks(Resource):
    def get(self):
        task_dict_list = [task.to_dict() for task in Task.query.all()]
        return (task_dict_list, 200) if task_dict_list else ({"message": "No Tasks Found"}, 404)

    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Unauthorized. Please login."}, 401)

        date_time_str = data.get("dateTime")
        if not date_time_str:
            return make_response({"error": "Start task date and time required."}, 400)

        try:
            if date_time_str.endswith("Z"):
                date_time_str = date_time_str.replace("Z", "+00:00")
            date_time = datetime.fromisoformat(date_time_str).replace(tzinfo=timezone.utc)
        except ValueError:
            return make_response({"error": "Invalid date format."}, 400)

        date_obj = Date.query.filter_by(date_time=date_time, user_id=user_id).first()
        if not date_obj:
            date_obj = Date(date_time=date_time, user_id=user_id)
            db.session.add(date_obj)
            db.session.flush()

        due_datetime = None
        if data.get('dueDateTime'):
            try:
                due_datetime = datetime.fromisoformat(data['dueDateTime'])
            except ValueError:
                return make_response({"error": "Invalid format for dueDateTime."}, 400)

        repeat = data.get('repeat')
        repeated_tasks = []

        if repeat in ['daily', 'weekly', 'monthly']:
            delta = {
                'daily': timedelta(days=1),
                'weekly': timedelta(weeks=1),
                'monthly': relativedelta(months=1)
            }[repeat]
            occurrences = {'daily': 30, 'weekly': 4, 'monthly': 3}[repeat]

            for i in range(occurrences):
                task_date_time = date_time + (delta * i if isinstance(delta, timedelta) else relativedelta(months=i))
                date_entry = Date.query.filter_by(date_time=task_date_time, user_id=user_id).first()
                if not date_entry:
                    date_entry = Date(date_time=task_date_time, user_id=user_id)
                    db.session.add(date_entry)
                    db.session.flush()

                repeated_task = Task(
                    title=data.get('title'),
                    category=data.get('category'),
                    duration_minutes=data.get('duration'),
                    due_datetime=due_datetime,
                    status=data.get('status', 'pending'),
                    color=data.get('color'),
                    color_meaning=data.get('colorMeaning'),
                    repeat=repeat,
                    comments=data.get('comments'),
                    content=data.get('content'),
                    user_id=user_id,
                    date_id=date_entry.id
                )
                db.session.add(repeated_task)
                repeated_tasks.append(repeated_task)

            db.session.commit()
            db.session.commit()
            tasks_data = [task.to_dict() for task in repeated_tasks]
            ##print([task.to_dict() for task in repeated_tasks])
            return make_response({"tasks": tasks_data}, 201)


        new_task = Task(
            title=data.get('title'),
            category=data.get('category'),
            duration_minutes=data.get('duration'),
            due_datetime=due_datetime,
            status=data.get('status', 'pending'),
            color=data.get('color'),
            color_meaning=data.get('colorMeaning'),
            repeat=repeat,
            comments=data.get('comments'),
            content=data.get('content'),
            user_id=user_id,
            date_id=date_obj.id
        )

        db.session.add(new_task)
        db.session.commit()
        ##print(make_response(new_task.to_dict(), 201))
        return make_response(new_task.to_dict(), 201)

api.add_resource(Tasks, '/tasks')



class TasksById(Resource):
    def patch(self, id):
        data = request.get_json()

        task = Task.query.filter(Task.id == id).first()
        if not task:
            return make_response({"message": "Task not found"}, 404)

        for attr, value in data.items():
            setattr(task, attr, value)

        db.session.commit()
        return make_response(task.to_dict(), 201)

    def delete(self, id):
        user_id = session.get('user_id')
        
        if not user_id:
            return make_response({"error": "Unauthorized. Please login."}, 401)

        task = Task.query.filter(Task.id == id, Task.user_id == user_id).first()
        if not task:
            return make_response({"message": "Task not found"}, 404)

        delete_all_repeats = request.args.get('all', 'false').lower() == 'true'
        
        delete_date_ids = set()
        deleted_count = 0

        if delete_all_repeats and task.repeat in ['daily', 'weekly', 'monthly']:
            repeated_tasks = Task.query.filter_by(
                user_id=user_id,
                title=task.title,
                repeat=task.repeat
            ).all()
            for t in repeated_tasks:
                if t.date_id:
                    delete_date_ids.add(t.date_id)
                db.session.delete(t)
                deleted_count += 1
        else:
            if task.date_id:
                delete_date_ids.add(task.date_id)
            db.session.delete(task)
            deleted_count = 1

        # Clean up empty Date entries
        for date_id in delete_date_ids:
            if Task.query.filter_by(date_id=date_id).count() == 0:
                Date.query.filter_by(id=date_id).delete()

        db.session.commit()

        return make_response({
            "message": f"Deleted {deleted_count} task(s).",
            "repeating_tasks_deleted": delete_all_repeats
        }, 200)

api.add_resource(TasksById, "/tasks/<int:id>")



class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        print(session)
        if not user_id:
            return make_response({"message": "No user currently logged in"}, 401)

        user = User.query.filter(User.id == user_id).first()
        return make_response({'user': user.to_dict(rules=('-_password_hash',))}, 200) if user else make_response({"message": "User not found"}, 404)

api.add_resource(CheckSession, "/check_session")


class Logout(Resource):
    def delete(self):
        session.clear()
        return make_response({'message': 'Logged out successfully'}, 200)

api.add_resource(Logout, '/logout')



class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter(User.username == username).first()
        if not user:
            return make_response({'error': 'Username Not Found'}, 401)

        if user.authenticate(password):
            session['user_id'] = user.id
            return make_response({'user': user.to_dict(rules=('-_password_hash',))}, 200)
        else:
            return make_response({'error': 'Incorrect password'}, 401)

api.add_resource(Login, "/login")



class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return (users, 200) if users else ({"message": "No Users Found"}, 404)

    def post(self):
        data = request.get_json()
        if session.get("user_id"):
            return jsonify({"message": "Cannot create new account while logged in"})

        if not data:
            return jsonify({"message": "Invalid data. No data provided."}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and Password are required."}), 422

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username Already Taken."}), 422

        new_user = User(username=username)
        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(rules=('-_password_hash',)), 201

api.add_resource(Users, '/users')



class Dates(Resource):
    def get(self):
        dates = [date.to_dict() for date in Date.query.all()]
        return (dates, 200) if dates else ({"message": "No Dates Found"}, 404)

api.add_resource(Dates, '/dates')



if __name__ == '__main__':
    app.run(port=5555, debug=True)
