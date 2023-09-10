import datetime
import sys

from flask import Flask, request
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
time_data = []
json_data = []


@app.route('/send_json', methods=['POST'])
def send_json():
    json_data.append(
        {
            "json": json.loads(request.data.decode().replace("'", '"')).get("data"),
            "created_at": str(datetime.datetime.now())
        }
    )

    return "{}"


@app.route('/send_duration', methods=['POST'])
def send_duration():
    time_data.append(
        {
            "duration": json.loads(request.data.decode().replace("'", '"')).get("duration"),
            "created_at": str(datetime.datetime.now())
        }
    )

    return "{}"


@app.route('/get_duration', methods=['GET'])
def get_duration():
    if time_data:
        return jsonify(
            time_data[-1]
        )
    else:
        return "{}"


@app.route('/get_json', methods=['GET'])
def get_json():
    if json_data:
        return jsonify(
            json_data[-1]
        )
    else:
        return "{}"


@app.errorhandler(Exception)
def handle_exception(e):
    return json.dumps({
        "description": str(e),
    }), 400


def jsonify(data):
    return app.response_class(
        response=json.dumps(data, indent=2),
        status=200,
        mimetype='application/json'
    )


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3003)
