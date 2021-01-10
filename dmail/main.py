from fastapi import FastAPI

from dmail import endpoints
from dmail.config import settings

app = FastAPI(title="Disposable Mail")

app.include_router(endpoints.router, prefix=settings.API_ROUTE)
