import pymongo
import os

client = pymongo.MongoClient(os.environ['MONGO_URI'])
db = client['public']
collection = db['meshes']

def insert_mesh(mesh_name, mesh_file, stl_file):
  collection.insert_one({"name": mesh_name, "mesh_file": mesh_file, "stl_file": stl_file })

def find_all():
  cursor = collection.find({})
  assets = []
  for document in cursor:
    del document['_id']
    assets.append(document)
  return assets