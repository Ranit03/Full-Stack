import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define the path to the properties.json file
PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), 'properties.json')
print(f"Properties file path set to: {PROPERTIES_FILE}")

@app.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        with open(PROPERTIES_FILE, 'r') as f:
            properties = json.load(f)
            
        # Add IDs to properties if they don't have them
        for i, prop in enumerate(properties):
            if 'id' not in prop:
                prop['id'] = i + 1
                
        # Save the updated properties with IDs
        with open(PROPERTIES_FILE, 'w') as f:
            json.dump(properties, f, indent=2)
            
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
        print(f"Attempting to delete property with ID: {property_id}")
        
        # Ensure we're using the correct file path
        import os
        print(f"Current working directory: {os.getcwd()}")
        print(f"Properties file path: {PROPERTIES_FILE}")
        print(f"File exists: {os.path.exists(PROPERTIES_FILE)}")
        
        # Load existing properties
        with open(PROPERTIES_FILE, 'r') as f:
            properties = json.load(f)
            print(f"Loaded {len(properties)} properties from file")
        
        # Find the property to delete
        property_index = None
        for i, prop in enumerate(properties):
            if int(prop.get('id', 0)) == property_id:
                property_index = i
                break
        
        # If property found, remove it
        if property_index is not None:
            deleted_property = properties.pop(property_index)
            print(f"Removed property from list, new length: {len(properties)}")
            
            # Save updated properties list
            with open(PROPERTIES_FILE, 'w') as f:
                json.dump(properties, f, indent=2)
                print(f"Saved updated properties list to file")
            
            print(f"Property deleted successfully: {deleted_property}")
            
            return jsonify({
                'message': 'Property deleted successfully',
                'deleted': deleted_property
            }), 200
        else:
            print(f"Property with ID {property_id} not found")
            return jsonify({
                'error': 'Property not found'
            }), 404
    except Exception as e:
        import traceback
        print(f"Error deleting property: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

