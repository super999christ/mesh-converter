import boto3
import uuid
import os

def save_on_s3(file_content, file_name):
  aws_session = boto3.Session(
      aws_access_key_id=os.environ['AWS_ACCESS_KEY'],
      aws_secret_access_key=os.environ['AWS_SECRET_KEY']
  )
  s3 = aws_session.resource('s3', verify=False)
  file_object = s3.Object(os.environ['AWS_S3_BUCKET'], file_name)
  result = file_object.put(Body=file_content)
  return 'https://{1}.s3.amazonaws.com/{2}'.format(os.environ['AWS_S3_BUCKET'], file_name)

def save_on_disk(file_content, file_name):
  base_url = '../meshdata/'
  file_path = base_url + str(uuid.uuid4()) + "-" + file_name
  file = open(file_path, 'w')
  file.write(file_content)
  file.close()
  return file_path

def read_on_disk(file_path):
  file = open(file_path, 'r')
  file_data = file.read()
  file.close()
  return file_data