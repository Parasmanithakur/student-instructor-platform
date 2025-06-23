from mongoConn import MongoDBClient
from datetime import datetime
from werkzeug.security import generate_password_hash

db = MongoDBClient()

# Sample users (added more instructors)
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
        "username": "student3",
        "role": "student",
        "email": "student3@example.com",
        "password": generate_password_hash("password5")
    },
    {
        "_id": 4,
        "username": "instructor1",
        "role": "instructor",
        "email": "instructor1@example.com",
        "password": generate_password_hash("password3")
    },
    {
        "_id": 5,
        "username": "instructor2",
        "role": "instructor",
        "email": "instructor2@example.com",
        "password": generate_password_hash("password4")
    },
    {
        "_id": 6,
        "username": "instructor3",
        "role": "instructor",
        "email": "instructor3@example.com",
        "password": generate_password_hash("password6")
    },
    {
        "_id": 7,
        "username": "instructor4",
        "role": "instructor",
        "email": "instructor4@example.com",
        "password": generate_password_hash("password7")
    },
]

# Sample courses (added more courses)
courses = [
    {
        "_id": 101,
        "name": "Math 101",
        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/7/7b/IllustrationCentralTheorem.png",
        "description": "Basic algebra and calculus concepts",
        "instructor_id": 4,
        "tags": ["math", "algebra", "calculus"],
        "created_at": datetime(2024, 6, 21, 10, 0, 0)
    },
    {
        "_id": 102,
        "name": "Physics 101",
        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/CMB_Timeline300_no_WMAP.jpg/960px-CMB_Timeline300_no_WMAP.jpg",
        "description": "Introduction to classical mechanics",
        "instructor_id": 5,
        "tags": ["physics", "mechanics", "beginner"],
        "created_at": datetime(2024, 6, 21, 10, 5, 0)
    },
    {
        "_id": 103,
        "name": "Chemistry 101",
        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Chemicals_in_flasks.jpg",
        "description": "Basic chemistry concepts",
        "instructor_id": 6,
        "tags": ["chemistry", "organic", "inorganic"],
        "created_at": datetime(2024, 6, 21, 10, 10, 0)
    },
    {
        "_id": 104,
        "name": "Biology 101",
        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Biological_cell.svg",
        "description": "Introduction to biology",
        "instructor_id": 7,
        "tags": ["biology", "life", "science"],
        "created_at": datetime(2024, 6, 21, 10, 15, 0)
    },
    {
        "_id": 105,
        "name": "Computer Science 101",
        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tree_%28computer_science%29.svg",
        "description": "Introduction to programming",
        "instructor_id": 4,
        "tags": ["cs", "programming", "python"],
        "created_at": datetime(2024, 6, 21, 10, 20, 0)
    },
    {
        "_id": 106,
        "name": "English Literature",
        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/William_Shakespeare_by_John_Taylor%2C_edited.jpg/330px-William_Shakespeare_by_John_Taylor%2C_edited.jpg",
        "description": "Study of English literature",
        "instructor_id": 5,
        "tags": ["english", "literature", "reading"],
        "created_at": datetime(2024, 6, 21, 10, 25, 0)
    }
]

# Sample enrollments (each student has 3-4 courses)
enrollments = [
    # student1
    {"student_id": 1, "course_id": 101, "enrolled_at": datetime.utcnow()},
    {"student_id": 1, "course_id": 102, "enrolled_at": datetime.utcnow()},
    {"student_id": 1, "course_id": 103, "enrolled_at": datetime.utcnow()},
    {"student_id": 1, "course_id": 105, "enrolled_at": datetime.utcnow()},
    # student2
    {"student_id": 2, "course_id": 102, "enrolled_at": datetime.utcnow()},
    {"student_id": 2, "course_id": 104, "enrolled_at": datetime.utcnow()},
    {"student_id": 2, "course_id": 105, "enrolled_at": datetime.utcnow()},
    {"student_id": 2, "course_id": 106, "enrolled_at": datetime.utcnow()},
    # student3
    {"student_id": 3, "course_id": 101, "enrolled_at": datetime.utcnow()},
    {"student_id": 3, "course_id": 103, "enrolled_at": datetime.utcnow()},
    {"student_id": 3, "course_id": 104, "enrolled_at": datetime.utcnow()},
    {"student_id": 3, "course_id": 106, "enrolled_at": datetime.utcnow()},
]

# Sample assignments (added more assignments)
assignments = [
    {"_id": 1001, "course_id": 101, "title": "Algebra Homework", "due_date": datetime(2024, 7, 1)},
    {"_id": 1002, "course_id": 102, "title": "Newton's Laws", "due_date": datetime(2024, 7, 5)},
    {"_id": 1003, "course_id": 101, "title": "Calculus Quiz", "due_date": datetime(2024, 7, 10)},
    {"_id": 1004, "course_id": 102, "title": "Mechanics Lab Report", "due_date": datetime(2024, 7, 12)},
    {"_id": 1005, "course_id": 101, "title": "Algebra Project", "due_date": datetime(2024, 7, 15)},
    {"_id": 1006, "course_id": 102, "title": "Physics Midterm", "due_date": datetime(2024, 7, 20)},
    {"_id": 1007, "course_id": 103, "title": "Organic Chemistry Assignment", "due_date": datetime(2024, 7, 8)},
    {"_id": 1008, "course_id": 104, "title": "Cell Biology Quiz", "due_date": datetime(2024, 7, 9)},
    {"_id": 1009, "course_id": 105, "title": "Python Basics", "due_date": datetime(2024, 7, 11)},
    {"_id": 1010, "course_id": 106, "title": "Shakespeare Essay", "due_date": datetime(2024, 7, 13)},
    {"_id": 1011, "course_id": 103, "title": "Inorganic Chemistry Quiz", "due_date": datetime(2024, 7, 18)},
    {"_id": 1012, "course_id": 104, "title": "Genetics Assignment", "due_date": datetime(2024, 7, 19)},
]

# Sample submissions (added more submissions)
submissions = [
    # student1
    {"_id": 5001, "assignment_id": 1001, "student_id": 1, "submitted_at": datetime(2024, 6, 25, 14, 30, 0), "content": "Solution to Algebra Homework", "grade": 95},
    {"_id": 5002, "assignment_id": 1002, "student_id": 1, "submitted_at": datetime(2024, 6, 27, 12, 15, 0), "content": "Newton's Laws assignment submission", "grade": 90},
    {"_id": 5003, "assignment_id": 1003, "student_id": 1, "submitted_at": datetime(2024, 6, 28, 10, 0, 0), "content": "Calculus Quiz answers", "grade": 92},
    {"_id": 5004, "assignment_id": 1007, "student_id": 1, "submitted_at": datetime(2024, 6, 29, 11, 0, 0), "content": "Organic Chemistry Assignment", "grade": 88},
    {"_id": 5005, "assignment_id": 1009, "student_id": 1, "submitted_at": datetime(2024, 7, 1, 9, 0, 0), "content": "Python Basics", "grade": 93},

    # student2
    {"_id": 5006, "assignment_id": 1002, "student_id": 2, "submitted_at": datetime(2024, 6, 26, 16, 0, 0), "content": "My answers for Newton's Laws", "grade": 88},
    {"_id": 5007, "assignment_id": 1004, "student_id": 2, "submitted_at": datetime(2024, 6, 30, 13, 0, 0), "content": "Mechanics Lab Report", "grade": 85},
    {"_id": 5008, "assignment_id": 1009, "student_id": 2, "submitted_at": datetime(2024, 7, 2, 10, 0, 0), "content": "Python Basics", "grade": 91},
    {"_id": 5009, "assignment_id": 1010, "student_id": 2, "submitted_at": datetime(2024, 7, 3, 15, 0, 0), "content": "Shakespeare Essay", "grade": 87},
    {"_id": 5010, "assignment_id": 1012, "student_id": 2, "submitted_at": datetime(2024, 7, 4, 16, 0, 0), "content": "Genetics Assignment", "grade": 90},

    # student3
    {"_id": 5011, "assignment_id": 1001, "student_id": 3, "submitted_at": datetime(2024, 6, 25, 15, 0, 0), "content": "Algebra Homework", "grade": 89},
    {"_id": 5012, "assignment_id": 1007, "student_id": 3, "submitted_at": datetime(2024, 6, 29, 12, 0, 0), "content": "Organic Chemistry Assignment", "grade": 85},
    {"_id": 5013, "assignment_id": 1008, "student_id": 3, "submitted_at": datetime(2024, 6, 30, 14, 0, 0), "content": "Cell Biology Quiz", "grade": 90},
    {"_id": 5014, "assignment_id": 1010, "student_id": 3, "submitted_at": datetime(2024, 7, 3, 16, 0, 0), "content": "Shakespeare Essay", "grade": 92},
    {"_id": 5015, "assignment_id": 1011, "student_id": 3, "submitted_at": datetime(2024, 7, 5, 17, 0, 0), "content": "Inorganic Chemistry Quiz", "grade": 88},
]

def fill_data():
    db.users.delete_many({})
    db.courses.delete_many({})
    db.enrollments.delete_many({})
    db.assignments.delete_many({})
    db.submissions.delete_many({})

    db.users.insert_many(users)
    db.courses.insert_many(courses)
    db.enrollments.insert_many(enrollments)
    db.assignments.insert_many(assignments)
    db.submissions.insert_many(submissions)

if __name__ == "__main__":
    fill_data()