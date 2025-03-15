from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import os
import uuid  # To generate unique image names

app = Flask(__name__)
CORS(app)

# Configure DynamoDB (Using LocalStack)
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    endpoint_url = "http://localstack:4566",  # LocalStack endpoint
    aws_access_key_id="test",
    aws_secret_access_key="test"
)

# Configure S3 (Using LocalStack)
s3 = boto3.client(
    "s3",
    region_name="us-east-1",
    endpoint_url = "http://localstack:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test"
)

# Create S3 Bucket (if not exists)
BUCKET_NAME = "user-profile-pictures"
try:
    s3.create_bucket(Bucket=BUCKET_NAME)
except:
    pass  # Bucket already exists

# Create DynamoDB Table (if not exists)
table_name = "Users"
try:
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{"AttributeName": "email", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "email", "AttributeType": "S"}],
        ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1},
    )
    table.wait_until_exists()
except:
    table = dynamodb.Table(table_name)


# API Route to Add User + Upload Profile Picture
@app.route("/add_user", methods=["POST"])
def add_user():
    name = request.form.get("name")
    email = request.form.get("email")
    skills = request.form.get("skills")
    profile_picture = request.files.get("profile_picture")

    if not name or not email or not skills:
        return jsonify({"error": "Missing fields"}), 400

    # Upload Profile Picture to S3
    image_url = None
    if profile_picture:
        image_key = f"profile_pictures/{uuid.uuid4()}-{profile_picture.filename}"
        s3.upload_fileobj(profile_picture, BUCKET_NAME, image_key)
        image_url = f"http://localhost:4566/{BUCKET_NAME}/{image_key}"  # Public URL for LocalStack

    # Save user details in DynamoDB
    table.put_item(Item={"email": email, "name": name, "skills": skills, "profile_picture": image_url})

    return jsonify({"message": "User added successfully"}), 201


# API Route to Get All Users
@app.route("/users", methods=["GET"])
def get_users():
    response = table.scan()
    users = response.get("Items", [])
    return jsonify(users), 200


# API Route to Get a Single User by Email
@app.route("/user/<email>", methods=["GET"])
def get_user(email):
    response = table.get_item(Key={"email": email})
    user = response.get("Item")

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
