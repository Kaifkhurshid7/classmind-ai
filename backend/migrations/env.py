"""Alembic environment: the database URL comes from the app (programmatic run) or from the app settings (CLI)."""
from alembic import context
from sqlalchemy import create_engine

from app.config import Settings
from app.models import Base

config = context.config
url = (config.get_main_option("sqlalchemy.url") or Settings().db_url).replace("%%", "%")
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, render_as_batch=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_engine(url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, render_as_batch=True)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
