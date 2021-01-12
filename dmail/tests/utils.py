import random
from string import ascii_lowercase
from typing import Dict

from sqlalchemy.orm import Session

from dmail.models import Mailbox, Message


def random_lower_string(k=10) -> str:
    return "".join(random.choices(ascii_lowercase, k=k))


def random_address() -> str:
    username = random_lower_string()
    domain = random_lower_string()
    return f"{username}@{domain}.com"


def random_message_dict(to: str) -> Dict[str, str]:
    subject = random_lower_string()
    address = random_address()
    text = random_lower_string()
    message = {
        "from": address,
        "to": to,
        "subject": subject,
        "text": text,
    }
    return message


def random_message(db: Session, mailbox: Mailbox) -> Message:
    address = random_lower_string() + "@example.com"
    data = random_message_dict(to=address)
    message = Message(
        from_user=data["from"],
        to_user=data["to"],
        subject=data["subject"],
        text=data["text"],
    )
    mailbox.messages.append(message)
    db.add(message)
    db.commit()
    return message


def random_mailbox(db: Session) -> Mailbox:
    return Mailbox.generate(db)
