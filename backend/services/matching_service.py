from utils.text_processing import (
    clean_text,
    tokenize_and_lemmatize,
    extract_experience,
    extract_education,
)
from services.jd_service import extract_skills, get_top_keywords


def calculate_similarity(resume_text: str, jd_text: str) -> float:
    """
    Simple similarity score based on common tokens.
    Replaces sklearn TF-IDF + cosine similarity.
    """
    resume_tokens = set(tokenize_and_lemmatize(clean_text(resume_text)))
    jd_tokens = set(tokenize_and_lemmatize(clean_text(jd_text)))

    if not resume_tokens or not jd_tokens:
        return 0.0

    common = len(resume_tokens.intersection(jd_tokens))
    total = len(resume_tokens.union(jd_tokens))

    similarity = (common / total) * 100
    return round(similarity, 2)


def skill_match_score(resume_skills: list, jd_skills: list) -> dict:
    if not jd_skills:
        return {"matched": [], "missing": [], "score": 0.0}

    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched = sorted(resume_set & jd_set)
    missing = sorted(jd_set - resume_set)

    score = round((len(matched) / len(jd_set)) * 100, 2)

    return {
        "matched": matched,
        "missing": missing,
        "score": score,
    }


def experience_match_score(resume_text: str, jd_text: str) -> dict:
    resume_exp = extract_experience(resume_text)
    jd_exp = extract_experience(jd_text)

    def years(s):
        try:
            return int(s.split("+")[0])
        except:
            return None

    r_years = years(resume_exp)
    j_years = years(jd_exp)

    if r_years is None or j_years is None:
        score = 50.0
    elif r_years >= j_years:
        score = 100.0
    else:
        score = round((r_years / j_years) * 100, 2)

    return {
        "resume_experience": resume_exp,
        "jd_experience": jd_exp,
        "score": score,
    }


def education_match_score(resume_text: str, jd_text: str) -> dict:
    resume_edu = extract_education(resume_text)
    jd_edu = extract_education(jd_text)

    if jd_edu == "Not specified":
        score = 100.0
    elif resume_edu == jd_edu:
        score = 100.0
    elif resume_edu != "Not specified":
        score = 70.0
    else:
        score = 40.0

    return {
        "resume_education": resume_edu,
        "jd_education": jd_edu,
        "score": score,
    }


def keyword_coverage_score(resume_text: str, jd_text: str) -> float:
    jd_keywords = {k["keyword"] for k in get_top_keywords(jd_text, top_n=20)}

    if not jd_keywords:
        return 0.0

    resume_clean = clean_text(resume_text)

    covered = sum(
        1 for kw in jd_keywords
        if kw in resume_clean
    )

    return round((covered / len(jd_keywords)) * 100, 2)


def generate_recommendations(missing_skills: list, scoring: dict) -> list:
    recs = []

    if missing_skills:
        recs.append(
            f"Add these missing skills if you have experience with them: {', '.join(missing_skills[:5])}."
        )

    if scoring["experience"]["score"] < 70:
        recs.append(
            "Highlight more years of relevant work experience or quantify project durations."
        )

    if scoring["education"]["score"] < 70:
        recs.append(
            "Ensure your education section matches the qualification level required by the JD."
        )

    if scoring["keyword_coverage"] < 50:
        recs.append(
            "Incorporate more keywords from the job description naturally into your resume."
        )

    if not recs:
        recs.append(
            "Your resume is well-aligned with this job description."
        )

    return recs


def match_resume_to_jd(resume_text: str, jd_text: str) -> dict:
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    skills_result = skill_match_score(resume_skills, jd_skills)
    exp_result = experience_match_score(resume_text, jd_text)
    edu_result = education_match_score(resume_text, jd_text)

    keyword_cov = keyword_coverage_score(resume_text, jd_text)
    similarity = calculate_similarity(resume_text, jd_text)

    overall = (
        skills_result["score"] * 0.45
        + exp_result["score"] * 0.15
        + edu_result["score"] * 0.10
        + keyword_cov * 0.15
        + similarity * 0.15
    )

    overall = round(overall, 2)

    recommendations = generate_recommendations(
        skills_result["missing"],
        {
            "experience": exp_result,
            "education": edu_result,
            "keyword_coverage": keyword_cov,
        },
    )

    return {
        "match_score": overall,
        "matched_skills": skills_result["matched"],
        "missing_skills": skills_result["missing"],
        "recommendations": recommendations,
        "score_breakdown": {
            "skills_match": skills_result["score"],
            "experience_match": exp_result["score"],
            "education_match": edu_result["score"],
            "keyword_coverage": keyword_cov,
            "text_similarity": similarity,
        },
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "resume_strength": min(100.0, round(overall * 1.05, 2)),
    }