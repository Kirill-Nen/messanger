from sqlalchemy import Column, String, Integer, Boolean

from ..base import Base


class Message(Base):
    __tablename__ = 'messages'
    id = Column(
        Integer,
        nullable=False,
        autoincrement=True,
        primary_key=True
    )
    from_user = Column(
        Integer,
        nullable=False
    )
    to_user = Column(
        Integer,
        nullable=False
    )
    text = Column(
        String,
        nullable=False
    )
    is_read = Column(
        Boolean,
        nullable=False,
        default=False
    )
    time = Column(
        Integer,
        nullable=False
    )