-- SQLite schema (PostgreSQL-compatible with minor type tweaks)
-- For PostgreSQL: replace INTEGER PRIMARY KEY AUTOINCREMENT with SERIAL PRIMARY KEY
-- and TIMESTAMP DEFAULT CURRENT_TIMESTAMP works the same.

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    raw_text TEXT,
    extracted_skills TEXT,      -- JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE job_descriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    raw_text TEXT,
    extracted_skills TEXT,      -- JSON array
    priority_skills TEXT,       -- JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE analysis_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER,
    jd_id INTEGER,
    match_score REAL,
    matched_skills TEXT,        -- JSON array
    missing_skills TEXT,        -- JSON array
    score_breakdown TEXT,       -- JSON object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id),
    FOREIGN KEY (jd_id) REFERENCES job_descriptions(id)
);
