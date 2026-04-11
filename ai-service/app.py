from flask import Flask, request, jsonify
from model import predict_food
import os

app = Flask(__name__)

# ✅ Test route
@app.route('/')
def home():
    return "Python AI is running 🚀"

# ✅ Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({"error": "Empty file name"}), 400

        filepath = "temp.jpg"
        file.save(filepath)

        food = predict_food(filepath)

        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({"food": food})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)