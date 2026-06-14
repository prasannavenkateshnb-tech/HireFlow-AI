import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <span className="badge mb-4">AI-Powered Recruitment Platform</span>
      <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6 leading-tight">
        Job Description Analyzer &amp;{" "}
        <span className="text-primary-400">ATS Resume Matcher</span>
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto mb-10">
        Extract skills from job descriptions, match resumes with ATS scoring,
        identify skill gaps, and get AI-driven recommendations — all in one
        modern recruiter dashboard.
      </p>
      <div className="flex flex-wrap gap-4 justify-center mb-16">
        <Link to="/jd-analyzer" className="btn-primary">Analyze a Job Description</Link>
        <Link to="/resume-matcher" className="btn-secondary">Match My Resume</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">📄 JD Analyzer</h3>
          <p className="text-slate-400 text-sm">
            Extract technical skills, frameworks, tools and keywords from any job
            description using NLP and TF-IDF.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">🎯 ATS Resume Matcher</h3>
          <p className="text-slate-400 text-sm">
            Get an ATS-style match score with a breakdown across skills,
            experience, education and keyword coverage.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">📊 Skill Gap Analysis</h3>
          <p className="text-slate-400 text-sm">
            Visualize matching and missing skills with radar charts and get
            recommendations on what to learn next.
          </p>
        </div>
      </div>
    </div>
  );
}
