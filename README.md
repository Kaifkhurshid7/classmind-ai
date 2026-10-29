# ClassMind AI (prototype)

> The AI learning layer for every classroom. Turn every lecture into personalised learning.

A teacher speaks, ClassMind records and transcribes the lecture, AI turns it into structured
notes, and students learn from it with an AI tutor, quizzes, flashcards and a personal revision
plan. Everything exports to a cleanly aligned PDF.

## Tech stack

| Layer | Choice |
|-------|--------|
| Backend | Python 3.10+, Flask (app factory + blueprints), SQLite |
| AI | Anthropic Claude (`anthropic` SDK) with a built-in offline fallback engine |
| Export | ReportLab (PDF), Markdown / text |
| Frontend | React 18, TypeScript, Vite, React Router, TanStack Query; Web Speech API and MediaRecorder |
| Quality | pytest, ruff, vitest, `tsc`, GitHub Actions CI |
| Deploy | Docker / docker-compose, gunicorn |

## Quick start

Requires Python 3.10+ and Node 20+.

```bash
make install                      # Python + npm dependencies
cp .env.example .env              # optional: set ANTHROPIC_API_KEY for Claude-powered output
make run                          # builds the React app, then serves everything on :5000
```

Open **http://localhost:5000** in **Chrome or Edge** and allow the microphone.
Demo courses and lectures are created on first run (set `CLASSMIND_SEED=0` to disable).
The app works without an API key using the offline engine; with a key, Claude produces much better results.

**Development** (hot reload): run `make dev-backend` and `make dev-frontend` in two terminals, then open
**http://localhost:5173**. Vite proxies `/api` to Flask.

With Docker: `docker compose up --build`. Tests: `make test`. Lint and type-check: `make lint`.

## Demo data

On first run the app is filled with a realistic sample school so every screen has something to show:

- **5 courses** (Biology, Physics, Python, Modern Indian History, Microeconomics), each with an instructor, title and department
- **10 lectures of 10 to 13 minutes** (about 1,200 to 1,550 words each) with full spoken-style transcripts, timestamps and hand-written notes (summary, key points, concepts, sections, practice questions)
- Quizzes, flashcards, tutor conversations, bookmarks and about 50 quiz attempts spread over the last month, so the analytics dashboard (trends, course comparison, score distribution, learning gaps, activity feed) is fully populated

All people and content are fictional. Edit `backend/app/demo_data.py` (and the `demo_more_*.py` files with the second half of each lecture) to change it, then run `make reseed` to
wipe the database and reload (this deletes everything in it). Set `CLASSMIND_SEED=0` to start empty.
The demo lectures have no audio file, so the player is hidden for them; lectures recorded in the studio do.

## Brand and artwork

The logo (open book with an AI spark), favicon, hero illustration, subject covers for courses and faculty avatars are
original inline SVG in `frontend/src/components/Art.tsx` and `frontend/public/favicon.svg`. No external images are loaded.

## Features

**Capture (teacher)**
- Recording studio with live speech-to-text (English, Hindi, Odia), pause/resume and a live level meter
- Timestamped transcript lines and the original **audio is saved** with the lecture
- Live notes panel that updates while the teacher speaks
- No microphone? Paste text or upload a `.txt` transcript instead

**Learn (student)**
- Course-style lecture page: audio player (speed control), overview, notes, transcript, tutor, quiz, flashcards
- Transcript search, click a timestamp to jump the audio, the current line highlights as it plays
- Bookmark important moments
- **AI tutor** answers from the lecture only; modes: normal, explain simply, give an example, summarise. Chat history is saved
- **Quiz**: multiple-choice questions, instant scoring, answer review with explanations, attempt history
- **Flashcards** from key concepts and practice questions, with progress tracking and keyboard shortcuts
- **Personalised revision plan** built from your weak quiz topics and the questions you asked
- Short-answer practice questions with reveal

**Organise**
- Courses and lectures stored in SQLite, library with search across titles, notes and transcripts
- Edit notes, fix the transcript, rename or delete lectures, regenerate notes with AI

**Analytics (teacher)**
- Quiz performance per lecture, learning gaps (concepts students miss most), most-asked questions, 14-day activity

**Export**
- PDF (notes + transcript, notes only, transcript only) with timestamps, bookmarks and Q&A
- Markdown and plain text

**Roles**: switch between Teacher and Student view from the top bar (demo role switch, no login yet).

## Project layout

```
backend/
  app/
    __init__.py        create_app() application factory
    config.py          Environment-driven configuration
    database.py        SQLite schema and connection helpers
    errors.py          JSON error handlers, SPA fallback
    seed.py            Loads the demo data (python -m app.seed --reset)
    demo_data.py       Sample courses, faculty, transcripts and notes
    api/               HTTP layer (one blueprint per area)
      system.py  courses.py  lectures.py  learning.py  analytics.py  exports.py
    services/          Business logic, no HTTP concerns
      ai_engine.py     Notes + tutor (Claude, with offline fallback)
      quiz.py          Quiz generation + revision plans
      lectures.py      Shared lecture queries and serializers
      exporters.py     Markdown / text export
      pdf_export.py    PDF generation
  tests/               pytest suite
  wsgi.py              Dev server / gunicorn entry point
frontend/              React + TypeScript app (Vite)
  src/
    api/               Fetch client, TanStack Query hooks, API types
    components/        Layout, modals, menu, shared UI, Art (logo, hero and course artwork)
    context/           Role (teacher/student), toasts
    hooks/             useRecorder (speech-to-text, audio capture, level meter)
    pages/             Dashboard, Library, Course, Analytics, Studio, lecture/ (tabs)
    lib/  styles/
docs/API.md            API reference
data/                  Created at runtime (SQLite DB + audio), git-ignored
```

See [docs/API.md](docs/API.md) for the endpoint list.

## Responsive design

The UI is mobile-first friendly and has been checked with real device emulation at 320, 360, 390, 768 and 900 px
wide (no horizontal overflow on any page). Layout rules for tablet and phone live in
`frontend/src/styles/responsive.css`: icon-only navigation on tablets, single-column cards and full-width form fields
on phones, horizontally scrolling tab bars and tables, 16 px inputs (no iOS zoom), larger tap targets on touch devices
and reduced-motion support.

## Legal pages and site details

The app includes a Privacy Policy, Terms of Service, Cookie & Storage Policy and a Contact & Support page
(`/privacy`, `/terms`, `/cookies`, `/contact`), linked from the footer, plus a storage notice and an error boundary.

- Set your organisation name, support/privacy emails, address and governing law in `frontend/.env.local`
  (copy `frontend/.env.example`) and rebuild. They appear in the footer and policies.
- The policy text describes what this software actually does (local SQLite storage, browser speech recognition,
  optional Claude processing, Google Fonts, local storage only). It is a **template: have a lawyer review it for
  your jurisdiction** (e.g. India's DPDP Act, GDPR, school and child-privacy rules) before launching, and update it if you
  add login, analytics, or other data processing.

## Notes and limits (prototype)

- Speech recognition runs in the browser (Chrome/Edge) and needs an internet connection. Pages must be opened via `localhost` or HTTPS for microphone access.
- Offline mode quality is basic (keyword-based). Set `ANTHROPIC_API_KEY` for real AI.
- No login or multi-user separation yet: Teacher/Student is a view switch. Next steps: authentication, LMS integration (Moodle, Canvas, Google Classroom), per-student progress, classroom audio hardware, speech models that transcribe uploaded audio.
- Hindi/Odia text in PDFs needs a matching font added in `backend/app/services/pdf_export.py`.
# classmind-ai
