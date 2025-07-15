from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, Date, Task
from datetime import datetime

@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

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
            return {"message": "Invalid data. No data provided."}, 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {"error": "Username and Password are required."}, 422

        user = User.query.filter(User.username == username).first()
        if user:
            return {"error": "Username Already Taken."}, 422

        new_user = User(username=username)
        new_user.password_hash = password  

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(rules=('-_password_hash',)), 201

    
api.add_resource(Users, '/users')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
