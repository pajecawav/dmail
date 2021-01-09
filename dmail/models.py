import random
import string
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Session, relationship

from dmail.config import settings
from dmail.db import Base


class Mailbox(Base):
    __tablename__ = "mailboxes"

    address = Column(String, primary_key=True)
    messages = relationship("Message", backref="mailbox", cascade="delete")
    time_created = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )
    extension_user = Column(String, nullable=True)
    extension_name = Column(String, nullable=True)

    @property
    def full_address(self) -> str:
        return f"{self.address}@{settings.DOMAIN}"

    @classmethod
    def generate(
        cls,
        db: Session,
        *,
        extension_name: Optional[str] = None,
        extension_user: Optional[str] = None,
    ) -> "Mailbox":

        # TODO: check for already taken mailboxes?
        address = "".join(random.choices(string.ascii_lowercase, k=8))
        mailbox = db.query(cls).get(address)

        if mailbox is not None:
            mailbox.messages.clear()
            mailbox.extension_user = extension_user
            mailbox.extension_name = extension_name
            mailbox.time_created = datetime.utcnow()
        else:
            mailbox = cls(
                address=address,
                extension_name=extension_name,
                extension_user=extension_user,
            )

        db.add(mailbox)
        db.commit()

        return mailbox


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    from_user = Column(String, nullable=False)
    to_user = Column(String, ForeignKey(Mailbox.address), nullable=False)
    subject = Column(Text, nullable=False)
    text = Column(Text, nullable=False)
