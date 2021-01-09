from dmail import models  # noqa: F401
from dmail.db import Base, engine


def main() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    main()
