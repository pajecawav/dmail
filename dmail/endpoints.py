from fastapi import APIRouter, BackgroundTasks, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from dmail import extensions, models, schemas
from dmail.config import settings
from dmail.dependencies import get_db, parse_message

router = APIRouter()
router.include_router(extensions.router, prefix="/extensions")


def process_message(mailbox: models.Mailbox, message: models.Message) -> None:
    handler = extensions.HANDLERS.get(mailbox.extension_name, None)
    if handler is not None:
        handler.handle_message(mailbox, message)


@router.post("/mailboxes")
def new_mailbox(db: Session = Depends(get_db)):
    mailbox = models.Mailbox.generate(db)
    return mailbox.full_address


@router.post(settings.MAIL_ROUTE, include_in_schema=False)
def new_mail(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    message: models.Message = Depends(parse_message),
):
    mailbox = db.query(models.Mailbox).get(message.to_user)

    if mailbox is not None:
        mailbox.messages.append(message)
        db.add(message)
        db.add(mailbox)
        db.commit()
        background_tasks.add_task(process_message, mailbox, message)

    return ""


@router.get("/mailboxes/{address}", response_model=schemas.Mailbox)
def get_mail(address: str, db: Session = Depends(get_db)):
    mailbox = db.query(models.Mailbox).get(address)

    if not mailbox:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Mailbox not found"
        )

    return mailbox
