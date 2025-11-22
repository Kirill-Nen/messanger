from sqlalchemy import Column, Integer
import time

from ..base import Base


class Dialog(Base):
    __tablename__ = 'dialogs'
    id = Column(
        Integer,
        nullable=False,
        autoincrement=True,
        primary_key=True
    )
    user_first = Column(
        Integer,
        nullable=False
    )
    user_second = Column(
        Integer,
        nullable=False
    )
    time = Column(
        Integer,
        nullable=False,
        default=int(time.time())
    )