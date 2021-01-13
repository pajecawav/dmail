from datetime import datetime, timedelta

from dmail.config import settings
from dmail.dependencies import get_db
from dmail.models import Mailbox


def main() -> None:
    db = next(get_db())

    now = datetime.utcnow()
    earliest = now - timedelta(seconds=settings.MAILBOX_EXPIRE_SECONDS)

    rows_deleted = db.query(Mailbox).filter(Mailbox.time_created < earliest).delete()
    db.commit()
    print(f"Deleted {rows_deleted} mailboxes")


if __name__ == "__main__":
    main()
