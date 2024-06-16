 
import os
from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/secret.js')
def secret():

    return (
        "// please dont steal my keys"
        + "const sconf = {"
        + " host: " + repr(os.environ["KV_REST_API_URL"]) + ','
        + " token: " + repr(os.environ["KV_REST_API_TOKEN"])
        + "}"
    )

if __name__ == '__main__':
    app.run()
