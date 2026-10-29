# API reference

All endpoints are JSON unless noted. Errors return `{"error": "..."}`.

| Endpoint | Purpose |
|----------|---------|
| `GET /api/status` | AI availability and model |
| `POST /api/analyze` | Stateless analysis (live notes while recording) |
| `GET /api/overview`, `GET /api/analytics` | Dashboard data and teacher analytics |
| `GET/POST /api/courses`, `GET/PUT/DELETE /api/courses/<id>` | Courses |
| `GET/POST /api/lectures`, `GET/PUT/DELETE /api/lectures/<id>` | Lectures (search `?q=`, filter `?course=`) |
| `POST /api/lectures/<id>/analyze` | (Re)generate notes and quiz |
| `POST/GET /api/lectures/<id>/audio` | Upload / stream recorded audio |
| `POST /api/lectures/<id>/ask` | Ask the tutor (`mode`: simple, example, summary) |
| `DELETE /api/lectures/<id>/chat` | Clear chat history |
| `POST /api/lectures/<id>/quiz`, `/attempts` | Get quiz (answers hidden), submit answers |
| `POST /api/lectures/<id>/revision` | Personalised revision plan |
| `POST /api/lectures/<id>/bookmarks`, `DELETE /api/bookmarks/<id>` | Bookmarks |
| `GET /api/lectures/<id>/export?format=pdf\|md\|txt&mode=full\|notes\|transcript` | Downloads |
