from flask import Blueprint, request, jsonify, g

from .auth_controller import auth_key_required

from ..db.repositories.users import UserRepository
from ..db.models.users import User


blueprint = Blueprint(
    name='users',
    import_name=__name__,
    url_prefix='/api/users'
)


@blueprint.route('/register', methods=['POST', 'OPTIONS'])
def create_user():
    data = request.get_json()
    if data and 'username' in data and 'password' in data:
        username, password = data['username'], data['password']
        if not UserRepository.validate_exists(username):
            return jsonify({
                'success': False,
                'message': 'Такой пользователь уже существует.'
            }), 401
            
        user = UserRepository.add(username, password)
        if user:
            return jsonify({
                'success': True,
                'message': 'Вы успешно зарегистрировались в системе.',
                'token': user.create_auth_token()
            }), 201
        
    return jsonify({
        'success': False,
        'message': 'error'
    }), 401
    

@blueprint.route('/login', methods=['POST', 'OPTIONS'])
def login_user():
    data = request.get_json()
    if data:
        username, password = data['username'], data['password']
        user = UserRepository.get(User.username == username)
        if user and user.check_password(password):
            return jsonify({
                'success': True,
                'message': 'Вы успешно вошли в систему.',
                'token': user.create_auth_token()
            }), 200
        
    return jsonify({
        'success': False,
        'message': 'Неверные имя пользователя или пароль.'
    })
    

@blueprint.route('/validate_token')
@auth_key_required
def validate_token():
    return jsonify({'success': True})