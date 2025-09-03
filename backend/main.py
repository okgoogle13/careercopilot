# main.py
# Placeholder for the backend application.
# You can use Google AI Studio to generate the code for this file.

from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "Backend is running!"


if __name__ == "__main__":
    app.run(debug=True)
