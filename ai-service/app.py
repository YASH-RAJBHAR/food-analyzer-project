import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from model import predict_food, read_ocr_label, lookup_barcode_openfoodfacts, search_food_database, lookup_food_profile, ask_ai_coach_agent

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    temp_path = None
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        image_file = request.files["image"]
        filename = secure_filename(image_file.filename)

        if not filename:
            return jsonify({"error": "Invalid image file"}), 400

        temp_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(temp_path)

        predict_result = predict_food(temp_path)

        if isinstance(predict_result, dict):
            return jsonify({
                **predict_result,
                "message": "Prediction completed"
            })
        else:
            return jsonify({
                "food_name": str(predict_result),
                "predictedFood": str(predict_result),
                "confidence": 75.0,
                "topCandidates": [str(predict_result)],
                "cuisine": "Global",
                "region": "Global",
                "category": "Meal",
                "portion_estimate": "1 Serving",
                "portionSize": "1 Serving",
                "estimatedWeight": "300g",
                "cookingMethod": "Fresh Prepared",
                "low_confidence": False,
                "message": "Prediction completed"
            })
    except Exception as err:
        return jsonify({"error": str(err), "trace": traceback.format_exc()}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


@app.route("/search", methods=["GET"])
def search():
    try:
        q = request.args.get("q", "")
        if not q:
            return jsonify([])
        results = search_food_database(q)
        return jsonify(results)
    except Exception as err:
        return jsonify({"error": str(err)}), 500


@app.route("/correct", methods=["POST"])
def correct():
    try:
        body = request.get_json() or {}
        corrected_name = body.get("food_name", "Vada Pav")
        profile = lookup_food_profile(corrected_name)
        return jsonify({
            **profile,
            "confidence": 100.0,
            "user_corrected": True,
            "message": "Manual correction applied successfully"
        })
    except Exception as err:
        return jsonify({"error": str(err)}), 500


@app.route("/ocr", methods=["POST"])
def ocr():
    temp_path = None
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        image_file = request.files["image"]
        filename = secure_filename(image_file.filename)

        if not filename:
            return jsonify({"error": "Invalid image file"}), 400

        temp_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(temp_path)

        ocr_result = read_ocr_label(temp_path)

        return jsonify({
            **ocr_result,
            "message": "OCR label scan completed"
        })
    except Exception as err:
        return jsonify({"error": str(err), "trace": traceback.format_exc()}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


@app.route("/barcode/<code_str>", methods=["GET"])
def barcode(code_str):
    try:
        data = lookup_barcode_openfoodfacts(code_str)
        return jsonify({
            **data,
            "message": "Barcode lookup completed"
        })
    except Exception as err:
        return jsonify({"error": str(err)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    try:
        body = request.get_json() or {}
        question = body.get("question", "")
        answer = ask_ai_coach_agent(question)
        return jsonify({
            "question": question,
            "answer": answer,
            "agent": "Chef Bot AI Coach Agent API"
        })
    except Exception as err:
        return jsonify({"error": str(err)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "AI service is running", "endpoints": ["/predict", "/search", "/correct", "/ocr", "/barcode/<code_str>", "/chat"]})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)