"""JSON errors for /api; the built React app is served under /static, with a single-page fallback."""
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException


def register_error_handlers(app: FastAPI) -> None:
    frontend = app.state.config.frontend_dir

    @app.exception_handler(StarletteHTTPException)
    async def http_error(_req: Request, e: StarletteHTTPException):
        detail = "Not found" if e.status_code == 404 and e.detail == "Not Found" else e.detail
        return JSONResponse({"error": detail}, status_code=e.status_code)

    @app.exception_handler(RequestValidationError)
    async def invalid(_req: Request, e: RequestValidationError):
        err = e.errors()[0] if e.errors() else {}
        field = ".".join(str(p) for p in err.get("loc", ())[1:])
        return JSONResponse({"error": f"Invalid {field}: {err.get('msg', 'bad request')}" if field else "Bad request"}, status_code=400)

    if frontend.is_dir():
        app.mount("/static", StaticFiles(directory=frontend), name="static")

    @app.get("/{path:path}", include_in_schema=False)
    def spa(path: str):
        if path.startswith("api/") or not (frontend / "index.html").is_file():
            raise HTTPException(404, "Not found")
        return FileResponse(frontend / "index.html")
