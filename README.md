# AI Job Description Analyzer & ATS Resume Matcher (MVP)

A working core implementation of the platform: JD skill extraction, ATS resume
matching, skill gap analysis, and an analytics dashboard.

## Scope of this MVP

Implemented:
- JD Analyzer (skills, categories, TF-IDF keywords, keyword frequency, experience/education)
- ATS Resume Matcher (skills/experience/education/keyword-coverage/text-similarity scoring)
- Skill Gap Analysis (matching/missing skills + radar chart data)
- Analytics Dashboard (aggregate stats, most requested skills, recent reports)
- Bulk JD upload endpoint
- Resume summarizer (lightweight, template-based — no heavyweight transformer models)
- SQLite persistence with PostgreSQL-compatible schema

Not implemented (out of scope for this MVP, but architecture supports adding them):
- JWT auth/signup
- PDF/Excel report export
- Admin panel UI
- Sentence-transformer embeddings (TF-IDF cosine similarity used instead)
- Word cloud rendering (frequency data is provided; plug into a word-cloud lib)

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python -m nltk.downloader punkt punkt_tab stopwords wordnet
python app.py
```

Server runs at `http://localhost:5000`. SQLite DB (`database.db`) is created
automatically on first run.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` requests to
`http://localhost:5000`.

## API Endpoints

### POST /api/analyze-jd
Body: `multipart/form-data` with either `text` (string) or `file` (PDF/TXT).
Returns: skills, categorized_skills, keywords, keyword_frequency, experience,
education, priority_skills, total_skills_found, jd_id.

### POST /api/upload-resume
Body: `multipart/form-data` with `text` or `file` (PDF/DOCX/TXT).
Returns: resume_id, filename, extracted_skills, text_length.

### POST /api/match-resume
Body: `multipart/form-data` with `resume_text`/`resume_file` and `jd_text`/`jd_file`.
Returns: match_score, matched_skills, missing_skills, recommendations,
score_breakdown, resume_skills, jd_skills, resume_strength.

### POST /api/summarize-resume
Body: `multipart/form-data` with `text` or `file`.
Returns: summary, strengths, skill_highlights, categorized_skills, experience, education.

### POST /api/skill-gap
Body: same as `/match-resume`.
Returns: matching_skills, missing_skills, additional_resume_skills,
recommended_to_learn, radar_data.

### POST /api/bulk-analysis
Body: `multipart/form-data` with multiple `files` (PDFs/TXT).
Returns: files_processed, results (per-file summary), most_requested_skills.

### GET /api/analytics
Returns: total_jds, total_resumes, total_reports, average_match_score,
most_requested_skills, recent_reports.

## Database Schema

See `database/schema.sql`. SQLite is used for development; swap
`models/db.py`'s connection logic for `psycopg2`/SQLAlchemy to use PostgreSQL
in production — the table structure is already PostgreSQL-compatible.

## Extending This MVP

- **Auth**: add `flask-jwt-extended`, a `/auth/login` and `/auth/signup` route,
  and a `users` table insert/check (table already exists in schema).
- **Sentence Transformers**: swap `calculate_similarity` in
  `services/matching_service.py` to use `sentence-transformers` embeddings +
  cosine similarity instead of TF-IDF.
- **Reports export**: add a `/export-report` route using `reportlab` (PDF) or
  `openpyxl` (Excel), reading from `analysis_reports`.
- **Admin panel**: add a new React page that calls `/api/analytics` plus new
  list endpoints for resumes/JDs.
- **Deployment**: Frontend → Vercel (`npm run build`, serve `dist/`).
  Backend → Render (gunicorn + `app.py`, set `DATABASE_URL` env var and swap
  SQLite for PostgreSQL via SQLAlchemy).
