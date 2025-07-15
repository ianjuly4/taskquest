from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, Date, Task
from datetime import datetime


if __name__ == '__main__':
    app.run(port=5555, debug=True)
