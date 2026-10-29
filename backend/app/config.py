"""Application configuration, read from environment variables (see .env.example)."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # repository root


class Config:
    DATA_DIR = Path(os.environ.get("CLASSMIND_DATA", ROOT / "data"))
    FRONTEND_DIR = Path(os.environ.get("CLASSMIND_FRONTEND", ROOT / "frontend"))
    MAX_CONTENT_LENGTH = 120 * 1024 * 1024  # audio uploads
    SEED_DEMO = os.environ.get("CLASSMIND_SEED", "1") != "0"
    JSON_SORT_KEYS = False

    @property
    def DB_PATH(self) -> Path:
        return self.DATA_DIR / "classmind.db"

    @property
    def AUDIO_DIR(self) -> Path:
        return self.DATA_DIR / "audio"


class TestConfig(Config):
    SEED_DEMO = True
    TESTING = True
