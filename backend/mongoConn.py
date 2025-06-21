from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
load_dotenv()
uri = os.getenv("MONGO_URL")
from datetime import datetime



class MongoDBClient:
    def __init__(self):
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        try:
            print("Connecting to MongoDB...")
            # self.client.admin.command('ping')
            # # print("Pinged your deployment. You successfully connected to MongoDB!")
            self.db = self.client["auth_db"]
            self.users = self.db["users"]
        except Exception as e:
            print(e)

    def get_database(self, db_name):
        return self.client[db_name]

    def run_query(self, db_name, collection_name, query):
        db = self.get_database(db_name)
        collection = db[collection_name]
        return list(collection.find(query))

    def close(self):
        self.client.close()
