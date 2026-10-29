"""JSON error handlers; unknown non-API routes fall back to the single-page frontend."""
from flask import Flask, current_app, jsonify, request, send_from_directory


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def not_found(_e):
        if request.path.startswith("/api/"):
            return jsonify({"error": "Not found"}), 404
        return send_from_directory(current_app.config["FRONTEND_DIR"], "index.html")

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": getattr(e, "description", "Bad request")}), 400

    @app.errorhandler(413)
    def too_large(_e):
        return jsonify({"error": "Upload too large"}), 413
