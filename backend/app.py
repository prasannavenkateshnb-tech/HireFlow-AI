from flask import Flask, jsonify
from flask_cors import CORS

from models.db import init_db
from routes.api import api

app = Flask(__name__)
CORS(app)

app.register_blueprint(api, url_prefix="/api")


@app.route("/")
def health():
    return jsonify({"status": "ok", "service": "AI Job Description Analyzer & ATS Resume Matcher"})


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
