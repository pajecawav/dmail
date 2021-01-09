from typing import Optional

import telebot
from fastapi import APIRouter, Request
from sqlalchemy.orm import Session

from dmail.config import settings
from dmail.dependencies import get_db
from dmail.extensions.base import MessageHandlerBase
from dmail.models import Mailbox, Message

EXTENSION_NAME = "telegram"

router = APIRouter()


def get_mailbox(db: Session, user: str) -> Optional[Mailbox]:
    mailbox = (
        db.query(Mailbox)
        .filter(
            Mailbox.extension_name == EXTENSION_NAME and Mailbox.extension_user == user
        )
        .first()
    )
    return mailbox


class MailTeleBot(MessageHandlerBase, telebot.TeleBot):
    def handle_message(self, mailbox: Mailbox, message: Message) -> None:
        self.send_message(mailbox.extension_user, self._format_message(message))

    @staticmethod
    def _format_message(message: Message) -> str:
        return "\n\n".join(
            [message.from_user, message.subject, message.text.rstrip("\n")]
        )


bot = MailTeleBot(settings.TELEGRAM_BOT_TOKEN)


@bot.message_handler(commands=["start", "help"])
def command_start_help(message):
    bot.reply_to(message, "Available commands: /new, /address, /delete")


@bot.message_handler(commands=["new"])
def command_new(message):
    user = message.from_user.id

    if not user:
        bot.reply_to(message, "Can't detect user id")
        return

    db = next(get_db())

    mailbox = Mailbox.generate(db, extension_name=EXTENSION_NAME, extension_user=user)
    if mailbox is None:
        bot.reply_to(message, "You don't have a mailbox")
    else:
        bot.reply_to(message, f"Your mailbox is {mailbox.full_address}")


@bot.message_handler(commands=["delete"])
def command_delete(message):
    user = message.from_user.id
    db = next(get_db())

    mailbox = get_mailbox(db, user)
    if not mailbox:
        bot.reply_to(message, "You don't have a mailbox")
    else:
        db.delete(mailbox)
        db.commit()
        bot.reply_to(message, "Successfully deleted mailbox")


@bot.message_handler(commands=["address"])
def command_address(message):
    user = message.from_user.id
    db = next(get_db())
    mailbox = get_mailbox(db, user)
    if not mailbox:
        bot.reply_to(message, "You don't have a mailbox")
    else:
        bot.reply_to(message, f"Your mail address is: {mailbox.full_address}")


@bot.message_handler(commands=["ping"])
def pong(message):
    bot.reply_to(message, "pong")


@router.post(settings.TELEGRAM_WEB_HOOK_ROUTE)
async def process_telegram_updates(request: Request):
    json = await request.json()
    update = telebot.types.Update.de_json(json)
    bot.process_new_updates([update])
    return ""


bot.remove_webhook()
bot.set_webhook(url=settings.TELEGRAM_WEB_HOOK_FULL)
