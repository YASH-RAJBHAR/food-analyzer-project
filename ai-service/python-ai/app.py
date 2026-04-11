from flask import Flask, request, jsonify
from model import predict_food
import os

app = Flask(__name__)

# ✅ Test route (VERY IMPORTANT)
@app.route('/')
def home():
    return "Python AI is running 🚀"

# ✅ Main prediction API
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 🔹 Check file exists
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({"error": "Empty file name"}), 400

        # 🔹 Save file temporarily
        filepath = "temp.jpg"
        file.save(filepath)

        # 🔹 Predict
        food = predict_food(filepath)

        # 🔹 Delete temp file (cleanup)
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({"food": food})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)