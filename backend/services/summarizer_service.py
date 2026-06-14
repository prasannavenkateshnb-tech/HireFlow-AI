from utils.text_processing import extract_experience, extract_education
from services.jd_service import extract_skills, categorize_skills


def summarize_resume(resume_text: str) -> dict:
    """
    Lightweight extractive/template-based summary (no heavy transformer models).
    Produces a professional summary, strengths, and skill highlights.
    """
    skills = extract_skills(resume_text)
    categorized = categorize_skills(skills)
    experience = extract_experience(resume_text)
    education = extract_education(resume_text)

    top_skills = skills[:6]
    skill_str = ", ".join(top_skills) if top_skills else "various technical skills"

    summary = (
        f"Professional with {experience} of experience, skilled in {skill_str}. "
        f"Holds a {education.lower()} background"
        if education != "Not specified"
        else f"Professional with {experience} of experience, skilled in {skill_str}."
    )
    if education != "Not specified":
        summary += " and demonstrates strong technical proficiency across multiple domains."
    else:
        summary += " Demonstrates strong technical proficiency across multiple domains."

    strengths = []
    for category, items in categorized.items():
        if items:
            strengths.append(f"Strong foundation in {category}: {', '.join(items[:4])}")

    return {
        "summary": summary,
        "strengths": strengths,
        "skill_highlights": top_skills,
        "categorized_skills": categorized,
        "experience": experience,
        "education": education,
    }
