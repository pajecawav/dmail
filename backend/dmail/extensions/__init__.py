from typing import Dict

from fastapi import APIRouter

from . import telegram
from .base import MessageHandlerBase

router = APIRouter()

HANDLERS: Dict[str, MessageHandlerBase] = {telegram.EXTENSION_NAME: telegram.bot}

router.include_router(telegram.router, prefix="/telegram", include_in_schema=False)
