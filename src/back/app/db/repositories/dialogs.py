from sqlalchemy import select, insert, update, delete, or_
from typing import Union, List

from .queries import executeQuery, executeAddQuery
from ..models.dialogs import Dialog
from ..models.users import User
from ..repositories.users import UserRepository
from ..time import getCurrentTime, FORMAT


class DialogRepository:
    @staticmethod
    def get(user_id: int) -> List[dict]:
        result = executeQuery(select(Dialog).where(
                or_(
                    Dialog.user_first == user_id,
                    Dialog.user_second == user_id
                )
            )
        )
        chats = []
        for chat in result.all():
            companion = UserRepository.get(User.id == (chat.user_second if user_id == chat.user_first else chat.user_first))
            chats.append({
                'chat_id': chat.id,
                'user_entity': {
                    'id': companion.id,
                    'username': companion.username
                },
                'created': {
                    'time': getCurrentTime(),
                    'format': FORMAT
                }
            })
        return chats