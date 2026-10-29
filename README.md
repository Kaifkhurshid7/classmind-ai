<div align="center">

<img src="frontend/public/favicon.svg" alt="ClassMind AI logo" width="84" />

# ClassMind AI

**The AI learning layer for every classroom.**
Turn every lecture into personalised learning.

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-D97757)
![Status](https://img.shields.io/badge/status-prototype-orange)

<br />

<img src="docs/screenshots/dashboard.png" alt="ClassMind AI dashboard" width="900" />

</div>

---

A teacher speaks. ClassMind records and transcribes the lecture, AI turns it into structured notes, and
students learn from it with an **AI tutor, quizzes, flashcards and a personal revision plan**. Teachers see
**learning analytics** that show where understanding breaks down. Everything exports to PDF.

It works **with or without an API key**: a built-in offline engine produces notes, quizzes and answers, and
[Anthropic Claude](https://www.anthropic.com/) takes over for much higher quality when a key is configured.

## Table of contents

- [Features](#features)
- [Screenshots](#screenshots)
- [How it works](#how-it-works)
  - [System architecture](#system-architecture)
  - [From recording to learning](#from-recording-to-learning)
  - [User journeys](#user-journeys)
  - [AI engine selection](#ai-engine-selection)
  - [Data model](#data-model)
  - [Backend layers](#backend-layers)
  - [Development vs production](#development-vs-production)
  - [Build and deploy pipeline](#build-and-deploy-pipeline)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Demo data](#demo-data)
- [Project structure](#project-structure)
- [API overview](#api-overview)
- [Testing and quality](#testing-and-quality)
- [Design, responsiveness and accessibility](#design-responsiveness-and-accessibility)
- [Legal pages and site details](#legal-pages-and-site-details)
- [Troubleshooting](#troubleshooting)
- [Known limits and roadmap](#known-limits-and-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

| For teachers | For students | For everyone |
|---|---|---|
| **Recording studio** with live speech-to-text (English, Hindi, Odia), pause/resume and a level meter | **Course-style lecture page**: audio player with speed control, overview, notes, transcript | **Courses with faculty profiles** (name, title, department) |
| Timestamped transcript and the **original audio saved** | **Transcript search**, click a timestamp to jump the audio, bookmark moments | **Library** with search across titles, notes and transcripts |
| **Live notes panel** that updates while you speak | **AI tutor** that answers from the lecture only (normal, explain simply, give an example, summarise) | **PDF, Markdown and text export** (notes, transcript or both) |
| Edit notes and fix the transcript, regenerate with AI | **Quizzes** with instant scoring, explanations and attempt history | **Teacher and student views** (demo role switch) |
| **Analytics**: score trends, course comparison, learning gaps, most-asked questions, activity feed, CSV export | **Flashcards** from key concepts with progress tracking and keyboard shortcuts | **Responsive UI** for phones, tablets and desktops |
| No microphone? Paste text or upload a `.txt` transcript | **Personal revision plan** built from weak quiz topics and the questions you asked | Privacy, Terms and Cookie pages, Help center |

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lecture.png" alt="Lecture page with notes, concepts and progress" /><br /><sub><b>Lecture page</b>: overview, notes, transcript, tutor, quiz and flashcards</sub></td>
    <td width="50%"><img src="docs/screenshots/analytics.png" alt="Learning analytics dashboard" /><br /><sub><b>Learning analytics</b>: trends, course comparison, score distribution</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/library.png" alt="Lecture library with search and course filter" /><br /><sub><b>Library</b>: search, course filter and sorting</sub></td>
    <td width="50%"><img src="docs/screenshots/studio.png" alt="Recording studio" /><br /><sub><b>Recording studio</b>: live transcript and notes</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/mobile.png" alt="Mobile layouts: home, lecture and analytics" width="760" /><br />
  <sub><b>Mobile</b>: the same app on a 390 px wide phone</sub>
</p>

## How it works

### System architecture

The browser does the speech recognition and audio capture. The FastAPI backend stores everything in SQLite and
delegates text work to the services layer, which uses Claude when available and an offline engine otherwise.

```mermaid
flowchart LR
    subgraph Browser["Browser (React + TypeScript SPA)"]
        UI["Pages and components"]
        SR["Web Speech API<br/>live speech-to-text"]
        MR["MediaRecorder<br/>audio capture"]
        UI --- SR
        UI --- MR
    end

    subgraph Server["FastAPI backend"]
        API["REST API<br/>6 routers"]
        SVC["Services<br/>AI engine, quiz, export, PDF"]
        API --> SVC
    end

    DB[("SQLite<br/>courses, lectures, chats,<br/>attempts, bookmarks")]
    FS[["Audio files<br/>data/audio"]]
    CLAUDE{{"Anthropic Claude<br/>optional"}}
    OFFLINE["Offline engine<br/>keyword based"]

    UI <-->|"JSON over HTTP"| API
    MR -->|"upload audio"| API
    API <--> DB
    API <--> FS
    SVC -->|"API key set"| CLAUDE
    SVC -->|"no key or error"| OFFLINE
```

### From recording to learning

What happens between pressing **Start recording** and a student asking the tutor a question.

```mermaid
sequenceDiagram
    autonumber
    actor T as Teacher
    participant B as Browser
    participant A as FastAPI
    participant E as AI engine
    participant D as SQLite
    actor S as Student

    T->>B: Start recording
    B->>B: Speech recognition + audio capture
    loop about every 8 seconds
        B->>A: POST /api/analyze (live)
        A->>E: analyze with offline engine
        E-->>B: live notes panel
    end
    T->>B: Stop and save
    B->>A: POST /api/lectures (transcript, timestamps)
    A->>D: save lecture + quick offline notes
    B->>A: POST /api/lectures/:id/audio
    A->>D: store audio file
    B->>A: POST /api/lectures/:id/analyze
    A->>E: generate notes and quiz
    E-->>A: Claude result or offline fallback
    A->>D: save notes and quiz
    A-->>B: lecture ready

    S->>B: Open lecture, ask a question
    B->>A: POST /api/lectures/:id/ask
    A->>E: answer from the transcript
    E-->>A: grounded answer
    A->>D: save chat history
    A-->>B: answer shown in the tutor tab
    S->>B: Take quiz
    B->>A: POST /api/lectures/:id/attempts
    A->>D: score and save attempt
    A-->>B: result with explanations
```

### User journeys

```mermaid
flowchart TD
    Start(["Open ClassMind"]) --> Role{"Which view?"}

    Role -->|Teacher| T1["Record a lecture"]
    T1 --> T2["Live transcript and live notes"]
    T2 --> T3["Stop and save"]
    T3 --> T4["Notes, quiz and tutor generated"]
    T4 --> T5["Edit notes, export PDF"]
    T4 --> T6["Analytics: gaps, questions, trends"]
    T6 -->|"revisit a topic"| T1

    Role -->|Student| S1["Browse courses and library"]
    S1 --> S2["Open a lecture"]
    S2 --> S3["Read notes, search transcript, play audio"]
    S3 --> S4["Ask the AI tutor"]
    S3 --> S5["Take quiz and study flashcards"]
    S5 --> S6["Personal revision plan"]
    S6 --> S2
    S5 -->|"quiz results"| T6
    S4 -->|"questions asked"| T6
```

### AI engine selection

Every AI feature (notes, quiz, tutor, revision plan) goes through the same decision, so the app never
breaks when there is no key, no network or an API error.

```mermaid
flowchart TD
    Req(["AI request<br/>notes, quiz, answer, plan"]) --> Live{"Live preview<br/>while recording?"}
    Live -->|Yes| Off["Offline engine<br/>fast, free, runs locally"]
    Live -->|No| Key{"ANTHROPIC_API_KEY set?"}
    Key -->|No| Off
    Key -->|Yes| Call["Call Claude"]
    Call --> Ok{"Valid JSON response?"}
    Ok -->|Yes| Claude["Result marked engine = claude"]
    Ok -->|"No or error"| Fallback["Offline engine plus a note:<br/>'AI unavailable, used offline engine'"]
    Off --> Done(["Result returned to the UI"])
    Claude --> Done
    Fallback --> Done
```

### Data model

SQLite (or PostgreSQL) with foreign keys. Notes, quiz questions and transcript segments are stored as JSON text on the
lecture row. Deleting a lecture removes its chats, attempts and bookmarks; deleting a course keeps its lectures.

```mermaid
erDiagram
    COURSES ||--o{ LECTURES : "contains"
    LECTURES ||--o{ CHATS : "has"
    LECTURES ||--o{ ATTEMPTS : "has"
    LECTURES ||--o{ BOOKMARKS : "has"

    COURSES {
        int id PK
        text name
        text description
        text color
        text instructor
        text instructor_title
        real created
    }
    LECTURES {
        int id PK
        int course_id FK
        text title
        text transcript
        json segments
        json notes
        json quiz
        int duration
        text audio
        text lang
        real created
        real updated
    }
    CHATS {
        int id PK
        int lecture_id FK
        text role
        text content
        real created
    }
    ATTEMPTS {
        int id PK
        int lecture_id FK
        int score
        int total
        json details
        real created
    }
    BOOKMARKS {
        int id PK
        int lecture_id FK
        real t
        text text
        real created
    }
```

### Backend layers

The HTTP layer stays thin; business logic lives in services, and storage details are isolated in `database.py`.

```mermaid
flowchart LR
    FE["React frontend"] -->|"JSON over HTTP"| API
    API["<b>app/api</b><br/>one router per area:<br/>system, courses, lectures,<br/>learning, analytics, exports"]
    SVC["<b>app/services</b><br/>no HTTP concerns:<br/>ai_engine, quiz, lectures,<br/>exporters, pdf_export"]
    DBM["<b>database.py</b><br/>schema, migration,<br/>connection helpers"]
    STORE[("SQLite database<br/>and audio files")]
    CFG["<b>create_app()</b><br/>config.py and errors.py"]
    SEED["<b>seed.py</b><br/>demo_data and<br/>demo_more files"]

    CFG -.->|"configures"| API
    API --> SVC
    API --> DBM
    SVC --> DBM
    DBM --> STORE
    SEED --> DBM
```

### Development vs production

In development, Vite serves the UI with hot reload and proxies API calls. In production, FastAPI serves the
built UI and the API from one process.

```mermaid
flowchart LR
    subgraph Dev["Development: two terminals"]
        B1["Browser<br/>localhost:5173"] --> V["Vite dev server<br/>hot reload"]
        V -->|"/api/* proxy"| F1["uvicorn :5000<br/>auto-reload"]
    end

    subgraph Prod["Production: one process"]
        B2["Browser<br/>localhost:5000"] --> F2["uvicorn + FastAPI"]
        F2 -->|"/api/*"| API2["REST API"]
        F2 -->|"/static/* and any other route"| DIST[["frontend/dist<br/>built React app"]]
    end
```

### Build and deploy pipeline

```mermaid
flowchart LR
    Push(["git push"]) --> CI["GitHub Actions"]

    subgraph CI_Jobs["CI jobs"]
        J1["backend: ruff + pytest"]
        J2["frontend: vitest + tsc + vite build"]
    end
    CI --> J1
    CI --> J2

    subgraph Docker["Dockerfile: multi-stage"]
        S1["Stage 1: node 22 alpine<br/>npm ci, npm run build"]
        S2["Stage 2: python 3.12 slim<br/>pip install, copy backend"]
        S1 -->|"copy dist"| S2
    end

    J1 --> Docker
    J2 --> Docker
    S2 --> Run["uvicorn<br/>1 worker<br/>non-root user"]
    Run --> Vol[("Volume /data<br/>SQLite and audio")]
```

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Python 3.10+, FastAPI (app factory, routers, Pydantic request and response models), pydantic-settings |
| Database | SQLAlchemy 2 with Alembic migrations. SQLite by default, PostgreSQL via `DATABASE_URL` |
| AI | Anthropic Claude via the `anthropic` SDK, with a built-in offline fallback engine |
| Export | ReportLab (PDF), Markdown and plain text |
| Frontend | React 18, TypeScript, Vite 5, React Router 6, TanStack Query 5 |
| Browser APIs | Web Speech API (speech-to-text), MediaRecorder (audio), localStorage (preferences) |
| UI | Hand-written CSS, inline SVG icons, charts and artwork (no UI library, no external images) |
| Quality | pytest, ruff, vitest, `tsc`, GitHub Actions |
| Deploy | Docker multi-stage build, docker-compose (optional Postgres), gunicorn with uvicorn workers |

## Quick start

**Requirements:** Python 3.10+ and Node 20+. Use **Chrome or Edge** for live speech-to-text.

```bash
git clone <your-repo-url> classmind-ai
cd classmind-ai

make install                  # Python and npm dependencies
cp .env.example .env          # optional: add ANTHROPIC_API_KEY for Claude-powered output
make run                      # builds the React app, then serves everything on http://localhost:5000
```

Open **http://localhost:5000** and allow the microphone when asked. Demo courses, faculty and lectures are
created on the first run, so the app is never empty.

### Development with hot reload

```bash
make dev-backend              # terminal 1: FastAPI on :5000
make dev-frontend             # terminal 2: Vite on :5173 (open this one)
```

The UI runs on **http://localhost:5173** and proxies `/api` to the backend. If you see proxy errors such as
`ECONNREFUSED`, the backend is not running.

### Database and migrations

The schema lives in `backend/app/models.py` and is applied automatically on startup with Alembic. An existing
SQLite database from an earlier version is upgraded in place and keeps its data.

```bash
cd backend
alembic revision --autogenerate -m "describe the change"   # after editing models.py
alembic upgrade head                                       # also runs on startup
```

To use PostgreSQL, set `DATABASE_URL` (see `.env.example`). With Docker, `docker compose --profile postgres up --build`
starts a Postgres container alongside the app.

### Deploy a demo on Vercel

`vercel.json` defines two Vercel services: `frontend` (the Vite app, served at `/`) and `backend` (FastAPI, served
for `/api/*`). The backend receives the original `/api/...` path, so no prefix changes are needed. The frontend
calls the API from the browser with relative URLs, so no service bindings are used.

It is meant for demos: Vercel has no persistent disk, so the database lives in `/tmp` and is rebuilt from the
sample data on every cold start. Anything you create is temporary, and audio uploads over about 4.5 MB are
rejected by the platform (the transcript is still saved).

1. Push the repository to GitHub, then import it at vercel.com/new with the **Root Directory left as the repository root**.
2. Optional: add `ANTHROPIC_API_KEY` under Project, Settings, Environment Variables to use Claude.
3. Deploy. Or from a terminal: `npm i -g vercel && vercel --prod`. Locally, `vercel dev` runs both services.

For real use, deploy the Docker image (or the backend with PostgreSQL and file storage) and point Vercel at it.

### Docker

```bash
docker compose up --build     # http://localhost:5000, data kept in the classmind-data volume
```

### Useful commands

| Command | What it does |
|---|---|
| `make install` | Install Python and npm dependencies |
| `make run` | Build the frontend and serve everything from FastAPI on port 5000, with interactive API docs at `/api/docs` |
| `make dev-backend` / `make dev-frontend` | Run the two development servers |
| `make reseed` | **Delete all data** and reload the sample content |
| `make test` | Run backend (pytest) and frontend (vitest) tests |
| `make lint` | Run ruff and the TypeScript type check |
| `make docker` | Build and start the Docker container |

> On Windows without `make`, run the underlying commands from the [Makefile](Makefile) directly, for example
> `cd backend && python asgi.py`.

## Configuration

### Backend (environment variables, see [.env.example](.env.example))

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | _empty_ | Enables Claude for notes, quizzes, tutor answers and revision plans. Without it the offline engine is used. |
| `CLASSMIND_MODEL` | `claude-sonnet-5-5` | Claude model used when a key is set |
| `DATABASE_URL` | _empty_ | Empty uses SQLite in `CLASSMIND_DATA`. For PostgreSQL: `postgresql://user:password@host:5432/classmind` |
| `CLASSMIND_DATA` | `./data` | Folder for the SQLite database and recorded audio |
| `WEB_CONCURRENCY` | auto | Production worker processes: 1 on SQLite, up to 4 on PostgreSQL |
| `CLASSMIND_SEED` | `1` | Create demo data on first run. Set `0` to start empty. |
| `CLASSMIND_FRONTEND` | `frontend/dist` | Folder of the built frontend that FastAPI serves |
| `PORT` | `5000` | Port for `python asgi.py` |
| `RELOAD` | _unset_ | `1` enables the uvicorn auto-reloader (used by `make dev-backend`) |

### Frontend (build-time, see [frontend/.env.example](frontend/.env.example))

Copy to `frontend/.env.local` and rebuild. These appear in the footer and the legal pages.

| Variable | Purpose |
|---|---|
| `VITE_OPERATOR_NAME` | Organisation name |
| `VITE_CONTACT_EMAIL`, `VITE_PRIVACY_EMAIL` | Support and privacy contact addresses |
| `VITE_OPERATOR_ADDRESS` | Postal address (optional) |
| `VITE_GOVERNING_LAW` | Governing law shown in the Terms (default `India`) |
| `VITE_LINKEDIN_URL`, `VITE_YOUTUBE_URL`, `VITE_TWITTER_URL`, `VITE_GITHUB_URL` | Social links; a footer icon appears only for the ones you set |

## Demo data

On first run the app fills itself with a fictional sample school, so every screen has something to show:

- **8 courses**: Biology, Physics, Python, Modern Indian History, Microeconomics, Chemistry, Mathematics and English Communication, each with an instructor, title and department
- **13 lectures of 10 to 13 minutes** (about 1,200 to 1,570 words each) with spoken-style transcripts, timestamps and hand-written notes: summary, key points, concepts, sections and practice questions
- Quizzes, flashcards, tutor conversations, bookmarks and about 60 quiz attempts spread over the last month, so analytics, learning gaps and progress are populated

The notes are marked **"Sample notes (demo)"**, not AI output. The demo lectures have no audio file, so the
player is hidden for them; lectures recorded in the studio get audio.

To change the content, edit `backend/app/demo_data.py` (plus `demo_more_*.py` and `demo_extra_courses.py`),
then run `make reseed`. This deletes everything in the database.

## Project structure

```text
classmind-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py          create_app() application factory
│   │   ├── config.py            environment-driven configuration
│   │   ├── models.py            SQLAlchemy schema (source of truth for migrations)
│   │   ├── database.py          engine, SQL helper and migration runner (SQLite or PostgreSQL)
│   │   ├── responses.py         Pydantic response models (shown at /api/docs)
│   │   ├── errors.py            JSON error handlers, /static mount and single-page-app fallback
│   │   ├── schemas.py           Pydantic request bodies
│   │   ├── seed.py              loads demo data:  python -m app.seed --reset
│   │   ├── demo_data.py         sample courses, faculty, transcripts and notes
│   │   ├── demo_more_*.py       second half of each lecture (bio, stem, humanities, extra)
│   │   ├── demo_extra_courses.py  Chemistry, Mathematics and English courses
│   │   ├── api/                 HTTP layer, one router per area
│   │   │   ├── deps.py          per-request database dependency
│   │   │   ├── system.py        status and live analysis
│   │   │   ├── courses.py       course CRUD
│   │   │   ├── lectures.py      lecture CRUD, analyze, audio
│   │   │   ├── learning.py      tutor chat, bookmarks, quiz, attempts, revision plan
│   │   │   ├── analytics.py     dashboard overview and teacher analytics
│   │   │   └── exports.py       PDF, Markdown and text downloads
│   │   └── services/            business logic, no HTTP concerns
│   │       ├── ai_engine.py     notes and tutor: Claude with offline fallback
│   │       ├── quiz.py          quiz generation and revision plans
│   │       ├── lectures.py      shared lecture queries and serializers
│   │       ├── exporters.py     Markdown and text export
│   │       └── pdf_export.py    PDF generation (ReportLab)
│   ├── tests/                   pytest suite
│   ├── migrations/              Alembic migrations, applied automatically on startup
│   ├── asgi.py                  ASGI entry point
│   ├── gunicorn.conf.py         production server settings (gunicorn + uvicorn workers)
│   └── requirements*.txt, pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── api/                 fetch client, TanStack Query hooks, API types
│   │   ├── components/          Layout, Footer, Select, Modal, Charts, Art (logo and artwork), HomeSections
│   │   ├── context/             role (teacher or student), toasts
│   │   ├── hooks/               useRecorder: speech-to-text, audio capture, level meter
│   │   ├── pages/               Dashboard, Library, Course, Analytics, Studio, lecture/ (tabs), legal/
│   │   ├── config/site.ts       organisation details from VITE_* variables
│   │   ├── lib/                 formatting helpers and safe storage
│   │   └── styles/              style.css plus home, analytics, select, footer-pages, responsive
│   ├── public/favicon.svg       logo and favicon
│   └── index.html, vite.config.ts, tsconfig.json
├── docs/
│   ├── API.md                   endpoint reference
│   └── screenshots/             images used in this README
├── .github/workflows/ci.yml     CI: lint, tests and build for both sides
├── Dockerfile, docker-compose.yml, Makefile
└── .env.example
```

## API overview

All endpoints return JSON, and errors look like `{"error": "..."}`. Full reference: [docs/API.md](docs/API.md).

| Area | Endpoints |
|---|---|
| System | `GET /api/status`, `POST /api/analyze` |
| Dashboard and analytics | `GET /api/overview`, `GET /api/analytics` |
| Courses | `GET/POST /api/courses`, `GET/PUT/DELETE /api/courses/<id>` |
| Lectures | `GET/POST /api/lectures` (`?q=` search, `?course=` filter), `GET/PUT/DELETE /api/lectures/<id>` |
| AI and media | `POST /api/lectures/<id>/analyze`, `POST/GET /api/lectures/<id>/audio` |
| Learning | `POST /api/lectures/<id>/ask`, `DELETE /api/lectures/<id>/chat`, `POST /api/lectures/<id>/quiz`, `POST /api/lectures/<id>/attempts`, `POST /api/lectures/<id>/revision` |
| Bookmarks | `POST /api/lectures/<id>/bookmarks`, `DELETE /api/bookmarks/<id>` |
| Export | `GET /api/lectures/<id>/export?format=pdf\|md\|txt&mode=full\|notes\|transcript` |

Quiz answers are never sent to the browser before an attempt is submitted.

## Testing and quality

```bash
make test        # backend: pytest (24 tests), frontend: vitest
make lint        # ruff + TypeScript type check
```

- **Backend tests** run the whole API against a temporary database per test, with no API key and no browser.
- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs `ruff` and `pytest` for the backend, and `vitest` plus the production build (which type-checks) for the frontend.
- Layout was checked with real device emulation at 320, 360, 390, 768 and 900 px wide, with an automated check for horizontal overflow.

## Design, responsiveness and accessibility

- **Responsive**: icon navigation on tablets, single-column layouts on phones, scrolling tab bars and tables, 16 px inputs so iOS does not zoom, larger tap targets on touch devices. Rules live in `frontend/src/styles/responsive.css`.
- **Accessible components**: a "Skip to main content" link, labelled controls, and a custom dropdown with full keyboard support (arrows, Home/End, Enter, Escape, type-ahead).
- **Motion**: animations are reduced for people who prefer reduced motion.
- **Error handling**: an error boundary shows a friendly message instead of a blank page if rendering fails.
- **Original artwork**: the logo, hero illustration, subject covers and illustrated faculty portraits are inline SVG in `frontend/src/components/Art.tsx`. No external images are loaded.

## Legal pages and site details

The app includes **Privacy Policy, Terms of Service, Cookie and Storage Policy, About, Help center and Contact**
pages (`/privacy`, `/terms`, `/cookies`, `/about`, `/help`, `/contact`), linked from the footer, plus a storage
notice. The app sets **no cookies** and has no analytics or ads.

> **The policy text is a template** that describes what this software does (local SQLite storage, browser speech
> recognition, optional Claude processing, Google Fonts, local storage only). **Have a lawyer review it** for
> your jurisdiction (for example India's DPDP Act, the GDPR and school or child-privacy rules) before launching,
> and update it if you add login, analytics or other data processing.

## Troubleshooting

| Problem | What to check |
|---|---|
| `ECONNREFUSED` or proxy errors in the Vite terminal | The FastAPI backend is not running. Start `make dev-backend`. |
| Blank page in development | Open the browser console. Hard refresh with `Ctrl+Shift+R`. |
| Microphone or live transcript does not work | Use Chrome or Edge, open the app on `localhost` or HTTPS, allow microphone access, and check your internet connection (speech recognition is online). |
| Notes say "Generated by offline engine" | No `ANTHROPIC_API_KEY` is set, or the API call failed. The top bar shows which engine is active. |
| Hindi or Odia text missing in PDFs | Add a matching font in `backend/app/services/pdf_export.py`. |
| Port 5000 is in use | Set `PORT=5001` and start the backend again (and update the proxy in `frontend/vite.config.ts`). |
| Demo data looks duplicated after a reset | Run `make reseed` once more with the dev server idle; the auto-reloader can re-seed while a reset is running. |
| `pytest` crashes on startup with an asyncio plugin error | A globally installed `pytest-asyncio` conflicts with the newer pytest. Run `python -m pytest -p no:asyncio`. |

## Known limits and roadmap

This is a **prototype**. Today:

- There is **no login**: Teacher and Student is a view switch, not a security boundary. Put it behind a school network or single sign-on before using real student data.
- SQLite allows one writer at a time, so the server runs a single worker unless `DATABASE_URL` points at PostgreSQL.
- The PostgreSQL path is covered by the portable SQL and the migration tests on SQLite, but the automated tests do not run against a live Postgres server yet.
- Live speech recognition needs **Chrome or Edge** and an internet connection.
- AI processing runs inside the web request, so very long lectures can be slow with Claude.

Ideas for next steps:

```mermaid
flowchart LR
    P["Prototype today"] --> A["Authentication<br/>and roles"]
    A --> B["PostgreSQL<br/>and migrations"]
    B --> C["Background jobs<br/>for AI work"]
    C --> D["Server-side speech models<br/>for uploaded audio"]
    D --> E["LMS integration<br/>Moodle, Canvas, Google Classroom"]
    A --> F["Per-student progress<br/>and class management"]
```

## Contributing

1. Fork the repository and create a branch.
2. Make your change, and add or update tests.
3. Run `make lint` and `make test`.
4. Open a pull request describing what changed and why.

## License

No license file has been added yet. Add a `LICENSE` file that matches how you want to share this project
(for example MIT or Apache-2.0) before publishing it publicly.
