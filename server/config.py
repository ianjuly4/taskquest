#/server/config.py
import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy

from dotenv import load_dotenv
load_dotenv()


app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build', 
    template_folder='../client/build'
)


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'instance', 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH}"
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.json.compact = False



metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)


migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
CORS(app, cors_allowed_origins=['http://localhost:5174/'], supports_credentials=True)

api = Api(app)


db.init_app(app)


__all__ = ["app", "db", "bcrypt", "migrate", "api", "os", "Flask", ]