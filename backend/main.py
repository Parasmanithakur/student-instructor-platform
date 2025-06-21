from flask import Flask, request, jsonify
from functools import wraps
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from mongoConn import MongoDBClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

db = MongoDBClient()       
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


def generate_token(user):
    return jwt.encode(
        {
            'sub': user['username'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(minutes=30)
        },
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            token = token.replace('Bearer ', '')
            data  = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = {'username': data['sub'], 'role': data['role']}
        except Exception:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(current_user, *args, **kwargs):
            if current_user['role'] != required_role:
                return jsonify({'message': 'Access denied!'}), 403
            return f(current_user, *args, **kwargs)
        return wrapper
    return decorator


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    role     = data.get('role', 'student')        

    if not username or not password:
        return jsonify({'message': 'Username & password required'}), 400

    if db.users.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 409

    hashed_pw = generate_password_hash(password)

    db.users.insert_one({
        'username': username,
        'password': hashed_pw,
        'role'    : role,
        "status": "active",
        "created_at": datetime.utcnow()
    })

    token = generate_token({'username': username, 'role': role})
    return jsonify({'token': token}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')

    user = db.users.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = generate_token(user)
    return jsonify({'token': token})


@app.route('/student/dashboard', methods=['GET'])
@token_required
@role_required('student')
def student_dashboard(current_user):
    return jsonify({'message': f"Welcome, {current_user['username']} (Student)"})

@app.route('/instructor/dashboard', methods=['GET'])
@token_required
@role_required('instructor')
def instructor_dashboard(current_user):
    return jsonify({'message': f"Welcome, {current_user['username']} (Instructor)"})

if __name__ == '__main__':
    app.run(debug=True)
