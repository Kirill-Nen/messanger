from sqlalchemy import select, insert, update, delete, or_
from werkzeug.security import generate_password_hash
from typing import Union

from .queries import executeQuery, executeAddQuery
from ..models.users import User


class UserRepository:
    @staticmethod
    def add(
        username: str,
        password: str
    ) -> User:
        user = User(
            username=username,
            password=generate_password_hash(password)
        )
        executeAddQuery(user)
        return user
    
    @staticmethod
    def validate_exists(
        username: str
    ) -> bool:
        result = executeQuery(select(User).where(User.username == username))
        return True if not result.first() else False
    
    @staticmethod
    def get(condition) -> Union[User, None]:
        result = executeQuery(select(User).where(condition))
        return result.first()
