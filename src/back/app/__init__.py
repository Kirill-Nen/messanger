from flask import Flask, request, jsonify
from flask.json import provider
from flask_cors import CORS
import os

from .db.config import settings
from .db.session import init_models

from .api.users import blueprint as api_users
from .api.dialogs import blueprint as api_chats

app = Flask(__name__)

CORS(
    app,
    origins=['*'],
    allow_headers=['*'],
    supports_credentials=True,
    methods=['POST', 'OPTIONS']
)

app.config['SECRET_KEY'] = settings.SECRET_KEY
app.config['JSON_SORT_KEYS'] = False

app.register_blueprint(api_users)
app.register_blueprint(api_chats)

provider.DefaultJSONProvider.sort_keys = False
provider.DefaultJSONProvider.ensure_ascii = False

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers

        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        headers['Access-Control-Allow-Headers'] = '*'
        headers['Access-Control-Allow-Credentials'] = 'true'

        return response