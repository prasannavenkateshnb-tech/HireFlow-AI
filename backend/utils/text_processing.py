import re
import io
import PyPDF2
import docx
import spacy
import nltk
from nltk.corpus import stopwords

# Download required NLTK data quietly (run-once)
for pkg in ("punkt", "punkt_tab", "stopwords", "wordnet"):
    try:
        nltk.data.find(f"corpora/{pkg}")
    except LookupError:
        try:
            nltk.download(pkg, quiet=True)
        except Exception:
            pass

try:
    NLP = spacy.load("en_core_web_sm")
except OSError:
    # Fallback: blank English pipeline if model not downloaded
    NLP = spacy.blank("en")

try:
    STOPWORDS = set(stopwords.words("english"))
except Exception:
    STOPWORDS = set()


def extract_text_from_pdf(file_stream) -> str:
    reader = PyPDF2.PdfReader(file_stream)
    text = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text.append(page_text)
    return "\n".join(text)


def extract_text_from_docx(file_stream) -> str:
    document = docx.Document(file_stream)
    return "\n".join(p.text for p in document.paragraphs)


def extract_text(file_storage) -> str:
    """Extract raw text from an uploaded file (PDF, DOCX, or plain text)."""
    filename = (file_storage.filename or "").lower()
    stream = io.BytesIO(file_storage.read())

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(stream)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(stream)
    else:
        return stream.read().decode("utf-8", errors="ignore")


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s\+\#\.\-/]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize_and_lemmatize(text: str) -> list:
    doc = NLP(text)
    tokens = []
    for token in doc:
        if token.is_space or token.is_punct:
            continue
        lemma = token.lemma_.lower().strip()
        if lemma and lemma not in STOPWORDS and len(lemma) > 1:
            tokens.append(lemma)
    return tokens


def extract_experience(text: str) -> str:
    """Naive regex-based experience extraction (years)."""
    match = re.search(r"(\d+)\+?\s*(?:years|yrs)", text.lower())
    if match:
        return f"{match.group(1)}+ years"
    return "Not specified"


def extract_education(text: str) -> str:
    edu_keywords = {
        "phd": "PhD",
        "doctorate": "PhD",
        "master": "Master's Degree",
        "m.tech": "Master's Degree",
        "mba": "MBA",
        "bachelor": "Bachelor's Degree",
        "b.tech": "Bachelor's Degree",
        "b.e": "Bachelor's Degree",
        "degree": "Degree Required",
    }
    text_lower = text.lower()
    for key, label in edu_keywords.items():
        if key in text_lower:
            return label
    return "Not specified"
