from fastapi import FastAPI

from dmail import endpoints
from dmail.config import settings

app = FastAPI(title="Disposable Mail", root_path=settings.API_ROUTE)

app.include_router(endpoints.router)
