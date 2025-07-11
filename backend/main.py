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
from bson import ObjectId
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
    role     = data.get('role')  # Get role from request
    print("Login data:", data)
    try:
        if not username or not password:
            return jsonify({'message': 'Username & password required'}), 400
        user = db.users.find_one({'username': username})
        print("User found:", user)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401

        # Check if role matches
        if role and user.get('role') != role:
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
    # Get the student's _id from the users collection
    student = db.users.find_one({'username': student_username}, {'_id': 1})
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    student_id = student['_id']

    # Find enrollments where student_id matches
    courses = list(db.enrollments.find({'student_id': student_id}, {'_id': 0}))
    print("Current user:", current_user)
    print("Student username:", student_username)
    print("Courses found for student:", courses)

    result = []
    for course in courses:
        course_id = course.get('course_id')
        # Get course details
        print("Course ID:", course_id)
        course_details = db.courses.find_one({'_id': course_id})
        print("Course details:", course_details)
        if not course_details:
            continue
    # Get instructor name from instructor_id
        instructor_id = course_details.get('instructor_id')
        instructor_name = ""
        if instructor_id:
            instructor = db.users.find_one({'_id': instructor_id}, {'username': 1})
            if instructor:
                instructor_name = instructor.get('username', '')

  
        # Find assignments for this course
        assignments = list(db.assignments.find({'course_id': course_id}, {'_id': 1, 'title': 1}))
        assignment_status = []
        for assignment in assignments:
            assignment_id = assignment['_id']
            submission = db.submissions.find_one({
            'assignment_id': assignment_id,
            'student': student_username
            })
            assignment_status.append({
            'assignment_id': int(assignment_id),
            'title': assignment.get('title', ''),
            'submitted': submission is not None
            })
        print("Assignments for course:", assignments)
        total_assignments = len(assignments)
        submitted_assignments = sum(1 for a in assignment_status if a['submitted'])
        progress = int((submitted_assignments / total_assignments) * 100) if total_assignments > 0 else 0
        result.append({
            '_id': str(course_details['_id']),
            'name': course_details.get('name', ''),
            'instructor': instructor_name,
            'thumbnail': course_details.get('thumbnail', ''),
            'description': course_details.get('description', ''),
            'category': course_details.get('tags', [])[0] if course_details.get('tags') else '',
            "dueDate": '2025-07-15T00:00:00Z',
            "assignment_status" : assignment_status,
            "progress": progress,
            "submitted_assignments":submitted_assignments,
            "total_assignments":total_assignments,

            "isCompleted": True if progress >= 100 else False,
        })

    return jsonify({'courses': result}), 200
    
@app.route('/student/assignments/<assignment_id>/submit', methods=['PATCH'])
@token_required
@role_required('student')
@swag_from({
    'tags': ['Student'],
    'summary': 'Submit an assignment',
    'parameters': [
        {
            'name': 'assignment_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'Assignment ID'
        }
    ],
    'security': [{'Bearer': []}],
    'responses': {
        200: {'description': 'Assignment submitted successfully'},
        400: {'description': 'Already submitted or invalid assignment'},
        404: {'description': 'Assignment not found'}
    }
})
def submit_assignment(current_user, assignment_id):
    student_username = current_user['username']
    try:
        assignment = db.assignments.find_one({'_id': int(assignment_id)})
        if not assignment:
            return jsonify({'message': 'Assignment not found'}), 404

        # Find the student's _id
        student = db.users.find_one({'username': student_username}, {'_id': 1})
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        student_id = student['_id']

        existing = db.submissions.find_one({
            'assignment_id': int(assignment_id),
            'student_id': student_id
        })
        if existing:
            return jsonify({'message': 'Assignment already submitted'}), 400

        submission = {
            'assignment_id': int(assignment_id),
            'student': student_username,
            'student_id': student_id,
            'submitted_at': datetime.utcnow(),
            'status': 'submitted'
        }
        db.submissions.insert_one(submission)
        return jsonify({'message': 'Assignment submitted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error submitting assignment', 'error': str(e)}), 500
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



@app.route('/instructor/courses', methods=['GET'])
@token_required
@role_required('instructor')
@swag_from({
    'tags': ['Instructor'],
    'summary': 'Get courses for the authenticated instructor',
    'security': [{'Bearer': []}],
    'responses': {
        200: {
            'description': 'List of courses for the instructor',
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
        404: {'description': 'No courses found for instructor'}
    }
})
def get_instructor_courses(current_user):
    instructor_username = current_user['username']
    instructor = db.users.find_one({'username': instructor_username}, {'_id': 1})
    if not instructor:
        return jsonify({'message': 'Instructor not found'}), 404
    instructor_id = instructor['_id']

    courses = list(db.courses.find({'instructor_id': instructor_id}))
    result = []
    for course in courses:
        course_id = course['_id']
        # Count total students enrolled
        total_students = db.enrollments.count_documents({'course_id': course_id})
        # Count active students (status == 'active')
        active_students = db.enrollments.count_documents({'course_id': course_id, 'status': 'active'})
        # Completion rate: students who submitted all assignments
        assignments = list(db.assignments.find({'course_id': course_id}, {'_id': 1, 'title': 1, 'dueDate': 1}))
        assignment_ids = [a['_id'] for a in assignments]
        students = db.enrollments.find({'course_id': course_id}, {'student_id': 1})
        completed_count = 0
        for s in students:
            student_id = s['student_id']
            submissions = db.submissions.count_documents({'assignment_id': {'$in': assignment_ids}, 'student_id': student_id, 'status': 'submitted'})
            if assignments and submissions == len(assignments):
                completed_count += 1
        completion_rate = int((completed_count / total_students) * 100) if total_students > 0 else 0

        # Assignments info
        assignments_info = []
        for a in assignments:
            assignments_info.append({
                'name': a.get('title', ''),
                'dueDate': a.get('dueDate', '2025-07-01T00:00:00Z')
            })

        result.append({
            '_id': str(course_id),
            'name': course.get('name', ''),
            'thumbnailUrl': course.get('thumbnail', 'https://source.unsplash.com/random/600x400/?python'),
            'totalStudents': total_students,
            'activeStudents': active_students,
            'completionRate': completion_rate,
            'lastUpdated': course.get('updated_at', '2025-06-20T10:30:00Z'),
            'category': course.get('tags', ['Programming'])[0] if course.get('tags') else 'Programming',
            'assignments': assignments_info
        })
    return jsonify({'courses': result}), 200

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
    return chat(data)


    @app.route('/browseCourses', methods=['GET'])
    @token_required
    @swag_from({
        'tags': ['Courses'],
        'summary': 'Browse all available courses',
        'security': [{'Bearer': []}],
        'responses': {
            200: {
                'description': 'List of all courses',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'courses': {
                            'type': 'array',
                            'items': {'type': 'object'}
                        }
                    }
                }
            }
        }
    })
    def browse_courses(current_user):
        courses = list(db.courses.find())
        result = []
        for course in courses:
            instructor = db.users.find_one({'_id': course.get('instructor_id')}, {'username': 1})
            result.append({
                '_id': str(course.get('_id')),
                'name': course.get('name', ''),
                'description': course.get('description', ''),
                'thumbnail': course.get('thumbnail', 'https://source.unsplash.com/random/600x400/?course'),
                'category': course.get('tags', [])[0] if course.get('tags') else '',
                'instructor': instructor.get('username', '') if instructor else '',
                'created_at': course.get('created_at', ''),
            })
        return jsonify({'courses': result}), 200


@app.route('/leaderboard', methods=['GET'])
@swag_from({
    'tags': ['Leaderboard'],
    'summary': 'Get leaderboard data',
    'responses': {
        200: {
            'description': 'Leaderboard data',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'username': {'type': 'string'},
                        'course': {'type': 'string'},
                        'submissions': {'type': 'integer'},
                        'score': {'type': 'integer'}
                    }
                }
            }
        }
    }
})
def leaderboard():
    pipeline = [
        {
            '$lookup': {
                'from': 'users',
                'localField': 'student_id',
                'foreignField': '_id',
                'as': 'student'
            }
        },
        {'$unwind': '$student'},
        {
            '$lookup': {
                'from': 'assignments',
                'localField': 'assignment_id',
                'foreignField': '_id',
                'as': 'assignment'
            }
        },
        {'$unwind': '$assignment'},
        {
            '$lookup': {
                'from': 'courses',
                'localField': 'assignment.course_id',
                'foreignField': '_id',
                'as': 'course'
            }
        },
        {'$unwind': '$course'},
        {
            '$group': {
                '_id': {
                    'username': '$student.username',
                    'course': '$course.name'
                },
                'submissions': {'$sum': 1},
                'score': {'$sum': {'$cond': [{'$eq': ['$status', 'submitted']}, 10, 0]}}
            }
        },
        {
            '$project': {
                '_id': 0,
                'username': '$_id.username',
                'course': '$_id.course',
                'submissions': 1,
                'score': 1
            }
        },
        {'$sort': {'score': -1, 'submissions': -1}}
    ]
    leaderboard_data = list(db.submissions.aggregate(pipeline))
    return jsonify(leaderboard_data), 200
if __name__ == '__main__':
    app.run(debug=True)
