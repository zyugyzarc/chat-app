import os
from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/secret.js')
def keys():

    if 'secret.js' in os.listdir():
        return send_from_directory('.', 'secret.js')

    return ( ""
        + "   /* Please dont steal my keys */  "
        + "   const sconf = {"
        + "      host: " + repr(os.environ['KV_REST_API_URL']) + ','
        + "      token: " + repr(os.environ['KV_REST_API_TOKEN'])
        + "}"
    )

@app.route('/')
def index():
    return send_from_directory('.', 'app.html')

@app.route('/<path:path>')
def file(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run()
