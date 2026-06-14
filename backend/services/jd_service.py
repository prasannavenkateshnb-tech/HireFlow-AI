from sklearn.feature_extraction.text import TfidfVectorizer
from utils.text_processing import clean_text, tokenize_and_lemmatize, extract_experience, extract_education
from utils.skill_data import ALL_SKILLS, SKILL_TO_CATEGORY, SKILL_CATEGORIES


def extract_skills(text: str) -> list:
    """Match known skills (multi-word aware) against the text."""
    cleaned = clean_text(text)
    found = set()
    for skill in ALL_SKILLS:
        # word-boundary-ish match for both single and multi-word skills
        pattern = skill.replace(".", r"\.").replace("+", r"\+").replace("#", r"\#")
        import re
        if re.search(rf"(?<![a-z0-9]){pattern}(?![a-z0-9])", cleaned):
            found.add(skill)
    return sorted(found)


def categorize_skills(skills: list) -> dict:
    categories = {cat: [] for cat in SKILL_CATEGORIES}
    for skill in skills:
        cat = SKILL_TO_CATEGORY.get(skill, "Other")
        categories.setdefault(cat, []).append(skill)
    return {k: v for k, v in categories.items() if v}


def get_top_keywords(text: str, top_n: int = 15) -> list:
    """TF-IDF based keyword extraction for a single document."""
    cleaned = clean_text(text)
    tokens = tokenize_and_lemmatize(cleaned)
    if not tokens:
        return []
    joined = " ".join(tokens)

    vectorizer = TfidfVectorizer(max_features=200, ngram_range=(1, 2))
    try:
        tfidf_matrix = vectorizer.fit_transform([joined])
    except ValueError:
        return []

    scores = tfidf_matrix.toarray()[0]
    feature_names = vectorizer.get_feature_names_out()

    pairs = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)
    return [{"keyword": k, "score": round(float(s), 4)} for k, s in pairs[:top_n] if s > 0]


def get_keyword_frequency(text: str, top_n: int = 15) -> list:
    cleaned = clean_text(text)
    tokens = tokenize_and_lemmatize(cleaned)
    freq = {}
    for tok in tokens:
        freq[tok] = freq.get(tok, 0) + 1
    sorted_items = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [{"word": w, "count": c} for w, c in sorted_items[:top_n]]


def analyze_job_description(text: str) -> dict:
    skills = extract_skills(text)
    categorized = categorize_skills(skills)
    keywords = get_top_keywords(text)
    keyword_freq = get_keyword_frequency(text)

    # priority skills = top skills that also appear in top keywords
    keyword_words = {k["keyword"] for k in keywords}
    priority_skills = [s for s in skills if any(s in kw or kw in s for kw in keyword_words)]
    if not priority_skills:
        priority_skills = skills[:5]

    return {
        "skills": skills,
        "categorized_skills": categorized,
        "keywords": keywords,
        "keyword_frequency": keyword_freq,
        "experience": extract_experience(text),
        "education": extract_education(text),
        "priority_skills": priority_skills[:10],
        "total_skills_found": len(skills),
    }
