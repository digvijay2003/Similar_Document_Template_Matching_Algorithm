from flask import Flask, request, jsonify
from Main import CHECK

app = Flask(__name__)

@app.route('/check-document', methods=['POST'])
def check_document():
    # Extract data from request
    image_path = request.form['image_path']
    document_type = request.form['document_type']

    # Call the CHECK function from Main.py
    result = CHECK(document_type, image_path)

    # Return result as JSON response
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(debug=True)
