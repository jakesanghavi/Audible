from pymongo import MongoClient
import json

# Connect to MongoDB
client = MongoClient("mongodb+srv://<username>:<password>@jssd.tllqcsq.mongodb.net/?retryWrites=true&w=majority")
db = client[{DB_NAME}]
collection = db[{COLLECTION_NAME}]

with open('output_test.json', 'r') as file:
    json_list = json.load(file)

result = collection.insert_many(json_list)
