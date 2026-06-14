"""
Static skill taxonomy used for extraction & categorization.
Extend these lists as needed.
"""

SKILL_CATEGORIES = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "sql"
    ],
    "Frameworks": [
        "react", "angular", "vue", "django", "flask", "spring", "spring boot",
        "express", "nextjs", "next.js", "nodejs", "node.js", "fastapi",
        "tensorflow", "pytorch", "keras", ".net", "laravel", "rails"
    ],
    "Databases": [
        "mysql", "postgresql", "postgres", "mongodb", "sqlite", "oracle",
        "redis", "cassandra", "dynamodb", "elasticsearch", "mariadb",
        "ms sql server", "sql server"
    ],
    "Cloud Technologies": [
        "aws", "azure", "gcp", "google cloud", "amazon web services",
        "ec2", "s3", "lambda", "cloudformation", "heroku", "vercel", "netlify"
    ],
    "DevOps Tools": [
        "docker", "kubernetes", "jenkins", "git", "github actions", "gitlab ci",
        "terraform", "ansible", "ci/cd", "circleci", "prometheus", "grafana", "nginx"
    ],
    "Soft Skills": [
        "communication", "leadership", "teamwork", "problem solving",
        "time management", "collaboration", "adaptability", "critical thinking",
        "mentoring", "presentation"
    ],
}

# Flattened lookup: skill -> category
SKILL_TO_CATEGORY = {
    skill: category
    for category, skills in SKILL_CATEGORIES.items()
    for skill in skills
}

ALL_SKILLS = list(SKILL_TO_CATEGORY.keys())
