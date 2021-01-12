from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from dmail.config import settings
from dmail.tests.utils import (random_mailbox, random_message,
                               random_message_dict)


def test_create_mailbox(client: TestClient) -> None:
    response = client.post(f"{settings.API_ROUTE}/mailboxes")
    assert response.status_code == 200
    address = response.text
    assert address.endswith(settings.DOMAIN)


def test_post_message(db: Session, client: TestClient) -> None:
    mailbox = random_mailbox(db)
    data = random_message_dict(to=mailbox.full_address)

    response = client.post(f"{settings.API_ROUTE}{settings.MAIL_ROUTE}", data=data)
    assert response.status_code == 200
    assert len(mailbox.messages) == 1
    message = mailbox.messages[0]
    assert message.subject == data["subject"]
    assert message.from_user == data["from"]
    assert message.to_user == mailbox.address
    assert message.text == data["text"]


def test_get_message(db: Session, client: TestClient) -> None:
    mailbox = random_mailbox(db)
    message = random_message(db, mailbox)

    response = client.get(f"{settings.API_ROUTE}/mailboxes/{mailbox.address}")
    assert response.status_code == 200
    json = response.json()
    assert json["full_address"] == mailbox.full_address
    assert "messages" in json
    messages = json["messages"]
    assert len(messages) == 1
    message2 = messages[0]
    assert message2["subject"] == message.subject
    assert message2["from_user"] == message.from_user
    assert message2["to_user"] == message.to_user
    assert message2["text"] == message.text
