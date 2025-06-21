from pymongo import MongoClient
from datetime import datetime
import bcrypt, uuid

client = MongoClient("mongodb+srv://<username>:<password>@cluster0.mongodb.net/")
db = client["auth_db"]
users = db["users"]

# Ensure uniqueness
users.create_index("username", unique=True)
users.create_index("email", unique=True)

hashed_pw = bcrypt.hashpw("test123".encode(), bcrypt.gensalt()).decode()

user = {
    "_id": str(uuid.uuid4()),
    "username": "john123",
    "email": "john@example.com",
    "password": hashed_pw,
    "role": "student",
    "status": "active",
    "created_at": datetime.utcnow(),
    "profile": {
        "full_name": "John Doe",
        "dob": "2000-01-01",
        "address": {
            "city": "Pune",
            "state": "Maharashtra"
        }
    }
}

users.insert_one(user)
print("User created.")
