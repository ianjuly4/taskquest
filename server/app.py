from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, Date, Task
from datetime import datetime

@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')


from datetime import datetime, timedelta

class Tasks(Resource):
    def post(self):
        data = request.get_json()

        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Unauthorized, Please Login to Continue"}, 401)

        date_str = data.get("date")
        if not date_str:
            return make_response({"error": "Date required."}, 400)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return make_response({"error": "Invalid date format. Use YYYY-MM-DD."}, 400)

        due_datetime_str = data.get('dueDateTime')
        due_datetime = None
        if due_datetime_str:
            try:
                due_datetime = datetime.fromisoformat(due_datetime_str)
            except ValueError:
                return make_response({"error": "Invalid datetime format for dueDateTime"}, 400)

        if data.get('repeat') == 'daily':
            repeated_tasks = []
            for i in range(30):  
                task_date = date_obj + timedelta(days=i)

                
                date_entry = Date.query.filter_by(date=task_date, user_id=user_id).first()
                if not date_entry:
                    date_entry = Date(date=task_date, user_id=user_id)
                    db.session.add(date_entry)
                    db.session.flush()  

         
                repeated_task = Task(
                    title=data.get('title'),
                    category=data.get('category'),
                    duration_minutes=data.get('duration'),
                    due_datetime=None,  
                    status=data.get('status'),
                    color=data.get('color'),
                    color_meaning=data.get('colorMeaning'),
                    repeat=None,  
                    comments=data.get('comments'),
                    content=data.get('content'),
                    user_id=user_id,
                    date_id=date_entry.id
                )

                db.session.add(repeated_task)
                repeated_tasks.append(repeated_task)

            db.session.commit()
            return make_response(
                {"message": f"{len(repeated_tasks)} daily repeating tasks created."},
                201
            )

        existing_date = Date.query.filter_by(date=date_obj, user_id=user_id).first()
        if not existing_date:
            existing_date = Date(date=date_obj, user_id=user_id)
            db.session.add(existing_date)
            db.session.flush()

        new_task = Task(
            title=data.get('title'),
            category=data.get('category'),
            duration_minutes=data.get('duration'),
            due_datetime=due_datetime,
            status=data.get('status'),
            color=data.get('color'),
            color_meaning=data.get('colorMeaning'),
            repeat=data.get('repeat'),
            comments=data.get('comments'),
            content=data.get('content'),
            user_id=user_id,
            date_id=existing_date.id
        )

        db.session.add(new_task)
        db.session.commit()

        return make_response(new_task.to_dict(), 201)

api.add_resource(Tasks, '/tasks')

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

        return jsonify(new_user.to_dict(rules=('-_password_hash',))), 201

    
api.add_resource(Users, '/users')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
