from flask import request


def body() -> dict:
    return request.get_json(silent=True) or {}
