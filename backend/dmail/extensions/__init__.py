from typing import Dict

from fastapi import APIRouter

from dmail.config import settings
from dmail.extensions.base import MessageHandlerBase

router = APIRouter()

HANDLERS: Dict[str, MessageHandlerBase] = {}

if settings.TELEGRAM_BOT_TOKEN:
    from . import telegram

    HANDLERS[telegram.EXTENSION_NAME] = telegram.bot
    router.include_router(telegram.router, prefix="/telegram", include_in_schema=False)
