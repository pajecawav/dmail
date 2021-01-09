from typing import List

from pydantic import BaseModel


class Message(BaseModel):
    id: int
    from_user: str
    to_user: str
    subject: str
    text: str

    class Config:
        orm_mode = True


class Mailbox(BaseModel):
    full_address: str
    messages: List[Message]

    class Config:
        orm_mode = True
