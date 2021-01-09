from abc import ABC, abstractclassmethod

from dmail.models import Mailbox, Message


class MessageHandlerBase(ABC):
    @abstractclassmethod
    def handle_message(self, mailbox: Mailbox, message: Message) -> None:
        pass
