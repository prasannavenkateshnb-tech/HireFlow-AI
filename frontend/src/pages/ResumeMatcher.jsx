import { useState } from "react";
import FileOrTextInput from "../components/FileOrTextInput";
import StatCard from "../components/StatCard";
import ScoreGauge from "../charts/ScoreGauge";
import ScoreBreakdownChart from "../charts/ScoreBreakdownChart";
import { matchResume } from "../services/api";

export default function ResumeMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    setError("");
    if ((!resumeText.trim() && !resumeFile) || (!jdText.trim() && !jdFile)) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await matchResume({ resumeText, jdText, resumeFile, jdFile });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong while matching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">ATS Resume Matcher</h1>
        <p className="text-slate-400">Upload or paste your resume and a job description to get an ATS match score.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FileOrTextInput label="Resume" accept=".pdf,.docx,.txt" onTextChange={setResumeText} onFileChange={setResumeFile} />
        <FileOrTextInput label="Job Description" accept=".pdf,.txt" onTextChange={setJdText} onFileChange={setJdFile} />
      </div>

      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={handleMatch} disabled={loading}>
          {loading ? "Matching..." : "Run ATS Match"}
        </button>
        {error && <p className="text-rose-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <ScoreGauge score={result.match_score} label="ATS Match Score" />
            </div>
            <StatCard label="Matched Skills" value={result.matched_skills.length} accent="green" />
            <StatCard label="Missing Skills" value={result.missing_skills.length} accent="red" />
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">ATS Match Breakdown</h3>
            <ScoreBreakdownChart breakdown={result.score_breakdown} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Matched Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.length ? result.matched_skills.map((s, i) => (
                  <span key={i} className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{s}</span>
                )) : <p className="text-slate-500 text-sm">No matched skills found.</p>}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.length ? result.missing_skills.map((s, i) => (
                  <span key={i} className="badge bg-rose-500/20 text-rose-300 border-rose-500/30">{s}</span>
                )) : <p className="text-slate-500 text-sm">No missing skills — great match!</p>}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Improvement Suggestions</h3>
            <ul className="space-y-2 list-disc list-inside text-slate-300 text-sm">
              {result.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
