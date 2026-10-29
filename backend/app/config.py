"""Application settings, read from environment variables (see .env.example)."""
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[2]  # repository root


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore", populate_by_name=True)

    data_dir: Path = Field(ROOT / "data", validation_alias=AliasChoices("data_dir", "CLASSMIND_DATA"))
    # Built React app (npm run build in frontend/); served under /static and as the SPA entry
    frontend_dir: Path = Field(ROOT / "frontend" / "dist", validation_alias=AliasChoices("frontend_dir", "CLASSMIND_FRONTEND"))
    seed_demo: bool = Field(True, validation_alias=AliasChoices("seed_demo", "CLASSMIND_SEED"))
    # Empty means SQLite inside data_dir. For Postgres: postgresql://user:password@host:5432/classmind
    database_url: str = Field("", validation_alias=AliasChoices("database_url", "DATABASE_URL"))
    max_upload_bytes: int = 120 * 1024 * 1024  # audio uploads

    @property
    def db_url(self) -> str:
        url = self.database_url.strip()
        if not url:
            return f"sqlite:///{(self.data_dir / 'classmind.db').as_posix()}"
        # hosting providers often hand out postgres:// URLs; SQLAlchemy needs the driver named
        for prefix in ("postgres://", "postgresql://"):
            if url.startswith(prefix):
                return "postgresql+psycopg://" + url[len(prefix) :]
        return url

    @property
    def audio_dir(self) -> Path:
        return self.data_dir / "audio"
