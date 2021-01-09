from pydantic import BaseSettings


class Settings(BaseSettings):
    DOMAIN: str

    MAIL_ROUTE: str
    MAILBOX_EXPIRE_SECONDS: int = 60 * 30  # 30 minutes

    API_ROUTE: str = ""
    DATABASE_URL: str

    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_WEB_HOOK_ROUTE: str
    TELEGRAM_WEB_HOOK_FULL: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
