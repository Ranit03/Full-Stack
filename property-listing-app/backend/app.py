from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Path to properties.json file
PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'properties.json')

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
        # Get the new property data from request
        new_property = request.json
        
        # Validate required fields
        required_fields = ['name', 'price', 'location', 'bedrooms', 'bathrooms']
        for field in required_fields:
            if field not in new_property or not new_property[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Convert numeric fields to integers
        for field in ['price', 'bedrooms', 'bathrooms']:
            new_property[field] = int(new_property[field])
        
        # If no image URL is provided, use a default one
        if not new_property.get('image_url'):
            new_property['image_url'] = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
        
        # Read existing properties
        with open(PROPERTIES_FILE, 'r') as f:
            properties = json.load(f)
        
        # Add new property
        properties.append(new_property)
        
        # Write back to file
        with open(PROPERTIES_FILE, 'w') as f:
            json.dump(properties, f, indent=4)
        
        return jsonify({"message": "Property added successfully", "property": new_property})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    try:
        # Load existing properties
        with open('properties.json', 'r') as f:
            properties = json.load(f)
        
        # Find the property to delete
        property_index = None
        for i, prop in enumerate(properties):
            if prop.get('id') == property_id:
                property_index = i
                break
        
        # If property found, remove it
        if property_index is not None:
            deleted_property = properties.pop(property_index)
            
            # Save updated properties list
            with open('properties.json', 'w') as f:
                json.dump(properties, f, indent=2)
            
            return jsonify({
                'message': 'Property deleted successfully',
                'deleted': deleted_property
            }), 200
        else:
            return jsonify({
                'error': 'Property not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

