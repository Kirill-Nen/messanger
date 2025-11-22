from flask import Blueprint, jsonify, g

from ..db.repositories.dialogs import DialogRepository

from .auth_controller import auth_key_required


blueprint = Blueprint(
    name='dialogs',
    import_name=__name__,
    url_prefix='/api/chats'
)

@blueprint.route('/')
@auth_key_required
def get_chats():
    result = DialogRepository.get(g.user.id)
    return jsonify({
        'success': True,
        'data': result
    })