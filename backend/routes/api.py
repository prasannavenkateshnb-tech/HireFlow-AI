import json
from flask import Blueprint, request, jsonify

from utils.text_processing import extract_text
from services.jd_service import analyze_job_description, extract_skills
from services.matching_service import match_resume_to_jd
from services.summarizer_service import summarize_resume
from models.db import get_db_connection

api = Blueprint("api", __name__)


# ---------- Helper ----------
def _get_text_from_request():
    """Accepts either raw text (form field 'text') or an uploaded file (field 'file')."""
    if "file" in request.files and request.files["file"].filename:
        return extract_text(request.files["file"])
    text = request.form.get("text") or (request.json or {}).get("text") if request.is_json else request.form.get("text")
    return text or ""


# ---------- 1. JOB DESCRIPTION ANALYZER ----------
@api.route("/analyze-jd", methods=["POST"])
def analyze_jd():
    text = _get_text_from_request()
    if not text.strip():
        return jsonify({"error": "No job description text or file provided"}), 400

    result = analyze_job_description(text)

    # Persist
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO job_descriptions (title, raw_text, extracted_skills, priority_skills) VALUES (?, ?, ?, ?)",
        ("Untitled JD", text, json.dumps(result["skills"]), json.dumps(result["priority_skills"])),
    )
    conn.commit()
    jd_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.close()

    result["jd_id"] = jd_id
    return jsonify(result), 200


# ---------- 2. UPLOAD RESUME ----------
@api.route("/upload-resume", methods=["POST"])
def upload_resume():
    text = _get_text_from_request()
    if not text.strip():
        return jsonify({"error": "No resume text or file provided"}), 400

    skills = extract_skills(text)
    filename = request.files["file"].filename if "file" in request.files else "pasted_resume.txt"

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO resumes (filename, raw_text, extracted_skills) VALUES (?, ?, ?)",
        (filename, text, json.dumps(skills)),
    )
    conn.commit()
    resume_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.close()

    return jsonify({
        "resume_id": resume_id,
        "filename": filename,
        "extracted_skills": skills,
        "text_length": len(text),
    }), 200


# ---------- 3. ATS RESUME MATCHER ----------
@api.route("/match-resume", methods=["POST"])
def match_resume():
    data = request.form if not request.is_json else request.json

    resume_text = data.get("resume_text", "")
    jd_text = data.get("jd_text", "")

    # Allow file uploads for either side
    if "resume_file" in request.files and request.files["resume_file"].filename:
        resume_text = extract_text(request.files["resume_file"])
    if "jd_file" in request.files and request.files["jd_file"].filename:
        jd_text = extract_text(request.files["jd_file"])

    if not resume_text.strip() or not jd_text.strip():
        return jsonify({"error": "Both resume_text and jd_text are required"}), 400

    result = match_resume_to_jd(resume_text, jd_text)

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO analysis_reports (match_score, matched_skills, missing_skills, score_breakdown) VALUES (?, ?, ?, ?)",
        (result["match_score"], json.dumps(result["matched_skills"]), json.dumps(result["missing_skills"]), json.dumps(result["score_breakdown"])),
    )
    conn.commit()
    conn.close()

    return jsonify(result), 200


# ---------- 4. AI RESUME SUMMARIZER ----------
@api.route("/summarize-resume", methods=["POST"])
def summarize():
    text = _get_text_from_request()
    if not text.strip():
        return jsonify({"error": "No resume text or file provided"}), 400

    result = summarize_resume(text)
    return jsonify(result), 200


# ---------- 5. SKILL GAP ANALYSIS ----------
@api.route("/skill-gap", methods=["POST"])
def skill_gap():
    data = request.form if not request.is_json else request.json
    resume_text = data.get("resume_text", "")
    jd_text = data.get("jd_text", "")

    if "resume_file" in request.files and request.files["resume_file"].filename:
        resume_text = extract_text(request.files["resume_file"])
    if "jd_file" in request.files and request.files["jd_file"].filename:
        jd_text = extract_text(request.files["jd_file"])

    if not resume_text.strip() or not jd_text.strip():
        return jsonify({"error": "Both resume_text and jd_text are required"}), 400

    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(jd_text))

    matching = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)
    extra = sorted(resume_skills - jd_skills)

    radar_data = [
        {"skill": s, "resume": 100 if s in resume_skills else 0, "jd": 100 if s in jd_skills else 0}
        for s in sorted(resume_skills | jd_skills)
    ]

    return jsonify({
        "matching_skills": matching,
        "missing_skills": missing,
        "additional_resume_skills": extra,
        "recommended_to_learn": missing[:8],
        "radar_data": radar_data,
    }), 200


# ---------- 6. ANALYTICS ----------
@api.route("/analytics", methods=["GET"])
def analytics():
    conn = get_db_connection()

    jd_count = conn.execute("SELECT COUNT(*) as c FROM job_descriptions").fetchone()["c"]
    resume_count = conn.execute("SELECT COUNT(*) as c FROM resumes").fetchone()["c"]
    report_count = conn.execute("SELECT COUNT(*) as c FROM analysis_reports").fetchone()["c"]

    avg_score_row = conn.execute("SELECT AVG(match_score) as avg FROM analysis_reports").fetchone()
    avg_score = round(avg_score_row["avg"], 2) if avg_score_row["avg"] else 0

    # Aggregate skill frequency across all JDs
    jds = conn.execute("SELECT extracted_skills FROM job_descriptions").fetchall()
    skill_freq = {}
    for row in jds:
        skills = json.loads(row["extracted_skills"] or "[]")
        for s in skills:
            skill_freq[s] = skill_freq.get(s, 0) + 1

    top_skills = sorted(skill_freq.items(), key=lambda x: x[1], reverse=True)[:10]

    recent_reports = conn.execute(
        "SELECT id, match_score, created_at FROM analysis_reports ORDER BY id DESC LIMIT 10"
    ).fetchall()

    conn.close()

    return jsonify({
        "total_jds": jd_count,
        "total_resumes": resume_count,
        "total_reports": report_count,
        "average_match_score": avg_score,
        "most_requested_skills": [{"skill": s, "count": c} for s, c in top_skills],
        "recent_reports": [dict(r) for r in recent_reports],
    }), 200


# ---------- 7. BULK JD ANALYSIS ----------
@api.route("/bulk-analysis", methods=["POST"])
def bulk_analysis():
    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files provided"}), 400

    aggregate_skills = {}
    results = []

    conn = get_db_connection()
    for f in files:
        text = extract_text(f)
        analysis = analyze_job_description(text)

        for s in analysis["skills"]:
            aggregate_skills[s] = aggregate_skills.get(s, 0) + 1

        conn.execute(
            "INSERT INTO job_descriptions (title, raw_text, extracted_skills, priority_skills) VALUES (?, ?, ?, ?)",
            (f.filename, text, json.dumps(analysis["skills"]), json.dumps(analysis["priority_skills"])),
        )
        results.append({
            "filename": f.filename,
            "skills_found": len(analysis["skills"]),
            "top_skills": analysis["skills"][:5],
        })

    conn.commit()
    conn.close()

    most_requested = sorted(aggregate_skills.items(), key=lambda x: x[1], reverse=True)[:15]

    return jsonify({
        "files_processed": len(files),
        "results": results,
        "most_requested_skills": [{"skill": s, "count": c} for s, c in most_requested],
    }), 200
