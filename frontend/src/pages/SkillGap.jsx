import { useState } from "react";
import FileOrTextInput from "../components/FileOrTextInput";
import SkillGapRadar from "../charts/SkillGapRadar";
import { skillGap } from "../services/api";

export default function SkillGap() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    if ((!resumeText.trim() && !resumeFile) || (!jdText.trim() && !jdFile)) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await skillGap({ resumeText, jdText, resumeFile, jdFile });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
        <p className="text-slate-400">Compare your resume against a job description to find matching and missing skills.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FileOrTextInput label="Resume" accept=".pdf,.docx,.txt" onTextChange={setResumeText} onFileChange={setResumeFile} />
        <FileOrTextInput label="Job Description" accept=".pdf,.txt" onTextChange={setJdText} onFileChange={setJdFile} />
      </div>

      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>
        {error && <p className="text-rose-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-8">
          <div className="card">
            <h3 className="font-semibold mb-4">Resume vs JD Skill Coverage</h3>
            <SkillGapRadar data={result.radar_data} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.matching_skills.map((s, i) => (
                  <span key={i} className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{s}</span>
                ))}
                {result.matching_skills.length === 0 && <p className="text-slate-500 text-sm">None found.</p>}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((s, i) => (
                  <span key={i} className="badge bg-rose-500/20 text-rose-300 border-rose-500/30">{s}</span>
                ))}
                {result.missing_skills.length === 0 && <p className="text-slate-500 text-sm">None found.</p>}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Recommended to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {result.recommended_to_learn.map((s, i) => (
                  <span key={i} className="badge bg-amber-500/20 text-amber-300 border-amber-500/30">{s}</span>
                ))}
                {result.recommended_to_learn.length === 0 && <p className="text-slate-500 text-sm">Nothing to recommend — great fit!</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
