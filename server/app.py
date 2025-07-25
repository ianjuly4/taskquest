from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, Date, Task
from datetime import datetime, timezone

@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta

class Tasks(Resource):
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

        due_datetime_str = data.get('dueDateTime')
        due_datetime = None
        if due_datetime_str:
            try:
                due_datetime = datetime.fromisoformat(due_datetime_str)
            except ValueError:
                return make_response({"error": "Invalid format for dueDateTime."}, 400)

        repeat = data.get('repeat')
        repeated_tasks = []

        if repeat in ['daily', 'weekly', 'monthly']:
            if repeat == 'daily':
                delta = timedelta(days=1)
                occurrences = 30
            elif repeat == 'weekly':
                delta = timedelta(weeks=1)
                occurrences = 4
            elif repeat == 'monthly':
                delta = relativedelta(months=1)
                occurrences = 3
            for i in range(occurrences):
                if isinstance(delta, timedelta):
                    task_date_time = date_time + delta * i
                else: 
                    task_date_time = date_time + relativedelta(months=i)
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
            return make_response(
                {"message": f"{len(repeated_tasks)} {repeat} repeating tasks created."},
                201
            )

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

        return make_response(new_task.to_dict(), 201)
    
api.add_resource(Tasks, '/tasks')

class TasksById(Resource):
    def patch(self, id):
        data = request.get_json()
        task = task.query.filter(Task.id == id).first()
        if not task:
            return make_response({"message": "Task not found"}, 404)

        for attr, value in data.items():
            setattr(task, attr, value)

        db.session.commit()
        return make_response(task.to_dict(), 201)
    
    def delete(self, id):
        delete_all = request.args.get('all', 'false').lower() == 'true'
        
        task = Task.query.filter(Task.id == id).first()
        if not task:
            return make_response({"message": "Task not found"}, 404)
        
        if delete_all and task.repeat:
           
            repeated_tasks = Task.query.filter_by(
                user_id=task.user_id,
                repeat=task.repeat,
                title=task.title  
            ).all()

            for t in repeated_tasks:
                db.session.delete(t)
            db.session.commit()
            return make_response({"message": f"Deleted {len(repeated_tasks)} repeated tasks"}, 200)
        
        # Delete single task only
        db.session.delete(task)
        db.session.commit()
        return make_response({"message": "Task successfully deleted"}, 200)
    
api.add_resource(TasksById, "/tasks/<int:id>")

class CheckSession(Resource):
    def get(self):
        print(f"Session contents: {session}")
        user_id = session.get("user_id")

        if not user_id:
            return make_response({"message": "No user currently logged in"}, 401)

        user = User.query.filter(User.id == user_id).first()

        if user:
            return make_response({'user':user.to_dict(rules=('-_password_hash',))}, 200)
        else:
            return make_response({"message": "User not found"}, 404)
        
api.add_resource(CheckSession, "/check_session")

class Logout(Resource):
    def delete(self):
        session.clear()
        response = make_response({'message': 'Logged out successfully'}, 200)
        return response

api.add_resource(Logout, '/logout')

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        print(f"Login attempt for username: {username}")

        user = User.query.filter(User.username == username).first()

        if not user:
            print(f"User not found: {username}")
            return make_response({'error': 'Username Not Found'}, 401)
        else:
            print(f"User found: {user.username}")

        if user.authenticate(password):
            session['user_id'] = user.id
            print("Session after login:", dict(session))
            return make_response({'user': user.to_dict(rules=('-_password_hash',))}, 200)
        else:
            print(f"Password mismatch for user {username}")
            return make_response({'error': 'Incorrect password'}, 401)

api.add_resource(Login, "/login")

class Users(Resource):
    def get(self):
        user_dict_list = [user.to_dict() for user in User.query.all()]
        if user_dict_list:
            return user_dict_list, 200
        else:
            return {"message": "No Users Found"}, 404
               
    def post(self):
        data = request.get_json()

        user_id = session.get("user_id")
        if user_id:
            return jsonify({"message": "Cannot create new account while logged in"})


        if not data:
            return jsonify({"message": "Invalid data. No data provided."}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and Password are required."}), 422

        user = User.query.filter(User.username == username).first()
        if user:
            return jsonify({"error": "Username Already Taken."}), 422

        new_user = User(username=username)
        new_user.password_hash = password  

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(rules=('-_password_hash',)), 201

api.add_resource(Users, '/users')

class Dates(Resource):
    def get(self):
        date_dict_list = [date.to_dict() for date in Date.query.all()]
        if date_dict_list:
            return date_dict_list, 200
        else:
            return {"message": "No Dates Found"}, 404
api.add_resource(Dates, '/dates')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
