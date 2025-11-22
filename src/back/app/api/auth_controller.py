from flask import request, g, jsonify
from functools import wraps
from typing import Union

from ..auth import decode_access_token
from ..db.models.users import User
from ..db.repositories.users import UserRepository
        
  
def auth_key_required(f):
    @wraps(f)
    def decFun(*args, **kwargs):
        token = request.headers.get('Auth-Key')

        if not token:
            return jsonify({
                'success': False,
                'message': 'missing auth key'
            }), 401
        
        userInfo = decode_access_token(token)
        if not userInfo:
            return jsonify({
                'success': False,
                'message': 'invalid auth key'
            }), 401
        
        userData = UserRepository.get(User.id == userInfo['id'])
        if not userData:
            return jsonify({
                'success': False,
                'message': 'user don\'t exists'
            }), 401
        
        g.user = userData

        return f(*args, **kwargs)
    return decFun