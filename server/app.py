from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, Date, Task
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta
from uuid import uuid4

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
        
        user = User.query.filter(User.id == user_id).first()
    

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

        new_task = Task(
            title=data.get('title'),
            duration=data.get('duration'),
            status=data.get('status', 'pending'),
            color=data.get('color'),
            content=data.get('content'),
            user_id=user_id,
            date_id=date_obj.id,
        )

        db.session.add(new_task)
        db.session.commit()
        
        return make_response(user.to_dict(), 201)

api.add_resource(Tasks, '/tasks')



class TasksById(Resource):
    def patch(self, id):
        data = request.get_json()

        user_id = session.get('user_id')

        if not user_id:
            return make_response({"error": "Unauthorized. Please login."}, 401)
        
        user = User.query.filter(User.id == user_id).first()

        task = Task.query.filter(Task.id == id).first()
        if not task:
            return make_response({"message": "Task not found"}, 404)

        for attr, value in data.items():
            setattr(task, attr, value)

        db.session.commit()
        return make_response(user.to_dict(), 201)


    def delete(self, id):
        user_id = session.get('user_id')

        if not user_id:
            return make_response({"error": "Unauthorized. Please login."}, 401)
        
        user = User.query.filter(User.id == user_id).first()
        
        task = Task.query.filter(Task.id == id).first()
        if not task:
            return make_response({"message": "Task not found"}, 404)
        
        db.session.delete(task)
        db.session.commit()
        return make_response(user.to_dict(), 200)
    

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
        users = [user.to_dict(rules=('-_password_hash',)) for user in User.query.all()]
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
