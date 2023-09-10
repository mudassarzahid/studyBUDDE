import datetime
import re
import sys

from flask import Flask, request
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

time_data = []
json_data = []
result_data = []


@app.route('/send_json', methods=['POST'])
def send_json():
    print(request.data, file=sys.stderr)
    if request.data == b"":
        print("EMPTY DATA", file=sys.stderr)
        raise Exception("Empty data.")

    json_data.append(
        {
            "json": request.data.decode().replace("'", '"'),
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


@app.route('/send_result', methods=['POST'])
def send_result():
    result_data.append(
        {
            "duration": json.loads(request.data.decode().replace("'", '"')).get("result"),
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
    if not json_data:
        return "{}"

    element = json_data[-1]["json"]
    count = dict()
    for category in element.split("\n"):
        try:
            data = eval(category)
            label, confidence = data[0][0]
            if label in count:
                count[label] += 1
            else:
                count[label] = 1

        except Exception as e:
            pass

    sorted_dict = dict(sorted(count.items(), key=lambda item: item[1]))
    all_count = sum(sorted_dict.values())

    focused = False
    for key, value in count.items():
        percentage = value / all_count
        count[key] = int(percentage * 100)
        if percentage > 0.7:
            focused = True

    count["meta"] = {
        "focused": focused
    }
    count["meta"]["highest"] = list(count.values())[0]

    return jsonify(count)


@app.route('/get_result', methods=['GET'])
def get_result():
    if result_data:
        return jsonify(
            result_data[-1]
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
