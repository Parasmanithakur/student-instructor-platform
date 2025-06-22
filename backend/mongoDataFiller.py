from mongoConn import MongoDBClient
from datetime import datetime
from werkzeug.security import generate_password_hash

db = MongoDBClient()

# Sample users
users = [
    {
        "_id": 1,
        "username": "student1",
        "role": "student",
        "email": "student1@example.com",
        "password": generate_password_hash("password1")
    },
    {
        "_id": 2,
        "username": "student2",
        "role": "student",
        "email": "student2@example.com",
        "password": generate_password_hash("password2")
    },
    {
        "_id": 3,
        "username": "instructor1",
        "role": "instructor",
        "email": "instructor1@example.com",
        "password": generate_password_hash("password3")
    },
    {
        "_id": 4,
        "username": "instructor2",
        "role": "instructor",
        "email": "instructor2@example.com",
        "password": generate_password_hash("password4")
    },
]

# Sample courses
courses = [
    {
        "_id": 101,
        "name": "Math 101",
        "thumbnail": "https://example.com/thumbnails/math101.png",
        "description": "Basic algebra and calculus concepts",
        "instructor_id": 3,
        "tags": ["math", "algebra", "calculus"],
        "created_at": datetime(2024, 6, 21, 10, 0, 0)
    },
    {
        "_id": 102,
        "name": "Physics 101",
        "thumbnail": "https://example.com/thumbnails/physics101.png",
        "description": "Introduction to classical mechanics",
        "instructor_id": 4,
        "tags": ["physics", "mechanics", "beginner"],
        "created_at": datetime(2024, 6, 21, 10, 5, 0)
    }
]

# Sample enrollments
enrollments = [
    {"student_id": 1, "course_id": 101, "enrolled_at": datetime.utcnow()},
    {"student_id": 2, "course_id": 102, "enrolled_at": datetime.utcnow()},
    {"student_id": 1, "course_id": 102, "enrolled_at": datetime.utcnow()},
]

# Sample assignments
assignments = [
    {"_id": 1001, "course_id": 101, "title": "Algebra Homework", "due_date": datetime(2024, 7, 1)},
    {"_id": 1002, "course_id": 102, "title": "Newton's Laws", "due_date": datetime(2024, 7, 5)},
    {"_id": 1003, "course_id": 101, "title": "Calculus Quiz", "due_date": datetime(2024, 7, 10)},
    {"_id": 1004, "course_id": 102, "title": "Mechanics Lab Report", "due_date": datetime(2024, 7, 12)},
    {"_id": 1005, "course_id": 101, "title": "Algebra Project", "due_date": datetime(2024, 7, 15)},
    {"_id": 1006, "course_id": 102, "title": "Physics Midterm", "due_date": datetime(2024, 7, 20)},
]
# Sample submissions
submissions = [
    {
        "_id": 5001,
        "assignment_id": 1001,
        "student_id": 1,
        "submitted_at": datetime(2024, 6, 25, 14, 30, 0),
        "content": "Solution to Algebra Homework",
        "grade": 95
    },
    {
        "_id": 5002,
        "assignment_id": 1001,
        "student_id": 2,
        "submitted_at": datetime(2024, 6, 26, 16, 0, 0),
        "content": "My answers for Algebra Homework",
        "grade": 88
    },
    {
        "_id": 5003,
        "assignment_id": 1002,
        "student_id": 1,
        "submitted_at": datetime(2024, 6, 27, 12, 15, 0),
        "content": "Newton's Laws assignment submission",
        "grade": None
    }
]

def fill_data():
    db.users.delete_many({})
    db.courses.delete_many({})
    db.enrollments.delete_many({})
    db.assignments.delete_many({})

    db.users.insert_many(users)
    db.courses.insert_many(courses)
    db.enrollments.insert_many(enrollments)
    db.assignments.insert_many(assignments)
    db.submissions.delete_many({})
    db.submissions.insert_many(submissions)

if __name__ == "__main__":
    fill_data()