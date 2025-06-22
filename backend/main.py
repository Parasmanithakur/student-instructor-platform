from flask import Flask, request, jsonify
from functools import wraps
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from mongoConn import MongoDBClient
import os
from dotenv import load_dotenv
from flasgger import Swagger, swag_from   
from ChatBot import chat       
app = Flask(__name__)
CORS(app)

db = MongoDBClient()       
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.config['SWAGGER'] = {
    "title": "Student‑Instructor Platform API",
    "uiversion": 3
}
swagger = Swagger(app)
def generate_token(user):
    return jwt.encode(
        {
            'sub': user['username'],
            'role': user['role'],
            '_id': str(user.get('_id', '')),
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
@swag_from({                                  
    'tags': ['Auth'],
    'summary': 'Create a new account (student or instructor)',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
               'properties': {
                        'username': {'type': 'string'},
                        'password': {'type': 'string'},
                        'role':     {'type': 'string',
                                     'enum': ['student', 'instructor']}
                    },
                'required': ['username', 'password']
            }
        }
    ],
    'responses': {
        201: {'description': 'Account created, JWT returned'},
        400: {'description': 'Missing data'},
        409: {'description': 'Username exists'}
    }
})
def signup():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    email    = data.get('email', '')
    role     = data.get('role', 'student')        

    if not username or not password:
        return jsonify({'message': 'Username & password required'}), 400

    if db.users.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 409
    
    if db.users.find_one({'email': email}):
        return jsonify({'message': 'email already exists'}), 409

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
@swag_from({
    'tags': ['Auth'],
    'summary': 'Authenticate user and return JWT',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string'},
                    'password': {'type': 'string'}
                },
                'required': ['username', 'password']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'JWT token returned on successful login'
        },
        401: {
            'description': 'Invalid credentials'
        }
    }
})
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    print("Login data:", data)
    try:
        if not username or not password:
            return jsonify({'message': 'Username & password required'}), 400
        user = db.users.find_one({'username': username})
        print("User found:", user)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401

        token = generate_token(user)
        db.logs.insert_one({
            'username': username,
            'action': 'login',
            'timestamp': datetime.utcnow(),
            'status': 'success'
        })
        return jsonify({'token': token})
    except Exception as e:
        print("Error during login:", e)
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

@app.route('/student/courses', methods=['GET'])
@token_required
@role_required('student')
@swag_from({
    'tags': ['Student'],
    'summary': 'Get courses for the authenticated student',
    'security': [{'Bearer': []}],
    'responses': {
        200: {
            'description': 'List of courses for the student',
            'schema': {
                'type': 'object',
                'properties': {
                    'courses': {
                        'type': 'array',
                        'items': {'type': 'object'}
                    }
                }
            }
        },
        404: {'description': 'No courses found for student'}
    }
})
def get_student_courses(current_user):
    student_username = current_user['username']
    courses = list(db.enrollments.find({'students': student_username}, {'_id': 0}))
 

    result = []
    for course in courses:
        course_id = course.get('_id')
        # Get course details
        course_details = db.courses.find_one({'_id': course_id}, {'_id': 1, 'name': 1, 'description': 1})
        if not course_details:
            continue

        # Find assignments for this course
        assignments = list(db.assignments.find({'course_id': course_id}, {'_id': 1, 'title': 1}))
        assignment_ids = [a['_id'] for a in assignments]
        num_assignments = len(assignments)

        num_submissions = db.submissions.count_documents({
            'assignment_id': {'$in': assignment_ids},
            'student': student_username
        })

        result.append({
            'course': {
                '_id': str(course_details['_id']),
                'name': course_details.get('name', ''),
                'thumbnail': course_details.get('thumbnail', ''),
                'description': course_details.get('description', '')
            },
            'num_assignments': num_assignments,
            'num_submissions': num_submissions
        })

    return jsonify({'courses': result}), 200
    

@app.route('/student/dashboard', methods=['GET'])
@token_required
@role_required('student')
@swag_from({
    'tags': ['Student'],
    'summary': 'Student dashboard (JWT required)',
    'security': [{'Bearer': []}],
    'responses': {200: {'description': 'Welcome student'}}
})
def student_dashboard(current_user):
    return jsonify({'message': f"Welcome, {current_user['username']} (Student)"})

@app.route('/instructor/dashboard', methods=['GET'])
@token_required
@role_required('instructor')
def instructor_dashboard(current_user):
    return jsonify({'message': f"Welcome, {current_user['username']} (Instructor)"})


@app.route('/chatter'   , methods=['POST'])
@swag_from({
    'tags': ['Chat'],
    'summary': 'Chat with the AI assistant',
   
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'context': {'type': 'string'}
                },
                'required': ['message', 'context']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Success response',
            'schema': {
                'type': 'object',
                'properties': {
                    'response': {'type': 'string'}
                }
            }
        }
    }
})
def chater():
    data = request.json or {}
    print ("DASDADA",data)
    return chat(data)

if __name__ == '__main__':
    app.run(debug=True)
