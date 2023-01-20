import json
import mongodb
import storage
import converter
import base64

def get_asset_list(event, context):
    assets = mongodb.find_all()
    response = {
        'statusCode': 200,
        'body': json.dumps(assets)
    }
    return response

def get_asset(event, context):
    # Gets HTTP body
    params = event['queryStringParameters']
    stl_path = params['stl_path']

    # Reads asset file
    stl_data = storage.read_on_disk(stl_path)

    # Result
    response = {
        'statusCode': 200,
        'headers': {"content-type": "text/plain"},
        'body': stl_data
    }
    return response

def upload(event, context):
    # Gets mesh data from client
    body_json = json.loads(event['body'])
    mesh_data = base64.b64decode(body_json['data']).decode('utf-8')
    mesh_data = mesh_data.replace('\r\n', '\n')
    mesh_name = body_json['name']

    # file_path = storage.save_on_s3(mesh_data, mesh_name)
    mesh_path = storage.save_on_disk(mesh_data, mesh_name)
    stl_path = converter.convert_to_stl(mesh_path)
    mongodb.insert_mesh(mesh_name, mesh_path, stl_path)
    
    # result
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'name': mesh_name,
            'stl_file': stl_path
        })
    }
    return response