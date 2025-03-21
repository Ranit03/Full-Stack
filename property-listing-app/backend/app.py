from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the path to the properties.json file
PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), 'properties.json')

# Create the properties.json file if it doesn't exist
if not os.path.exists(PROPERTIES_FILE):
    with open(PROPERTIES_FILE, 'w') as f:
        json.dump([], f)

@app.route('/')
def home():
    return jsonify({"message": "Property Listing API is running"})

@app.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        with open(PROPERTIES_FILE, 'r') as f:
            properties = json.load(f)
        return jsonify(properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties', methods=['POST'])
def add_property():
    try:
        new_property = request.json
        
        with open(PROPERTIES_FILE, 'r') as f:
            properties = json.load(f)
        
        # Generate a new ID
        new_id = 1
        if properties:
            new_id = max(prop.get('id', 0) for prop in properties) + 1
        
        new_property['id'] = new_id
        properties.append(new_property)
        
        with open(PROPERTIES_FILE, 'w') as f:
            json.dump(properties, f, indent=2)
        
        return jsonify(new_property), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)  # Run the app on the specified port

