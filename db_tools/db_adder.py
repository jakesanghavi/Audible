from pymongo import MongoClient
import json

# Connect to MongoDB
client = MongoClient("mongodb+srv://jake123:pipJ3UUy0KAcfgEB@jssd.tllqcsq.mongodb.net/?retryWrites=true&w=majority")
db = client["test"]
collection = db["songs"]

with open('output_test.json', 'r') as file:
    json_list = json.load(file)

result = collection.insert_many(json_list)