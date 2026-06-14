import { useState } from "react";
import FileOrTextInput from "../components/FileOrTextInput";
import StatCard from "../components/StatCard";
import KeywordBarChart from "../charts/KeywordBarChart";
import SkillCategoryPie from "../charts/SkillCategoryPie";
import { analyzeJD } from "../services/api";

export default function JDAnalyzer() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    if (!text.trim() && !file) {
      setError("Please paste a job description or upload a file.");
      return;
    }
    setLoading(true);
    try {
      const res = await analyzeJD({ text, file });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Job Description Analyzer</h1>
        <p className="text-slate-400">Paste a job description or upload a PDF to extract skills, keywords, and requirements.</p>
      </div>

      <FileOrTextInput
        label="Job Description"
        accept=".pdf,.txt"
        onTextChange={setText}
        onFileChange={setFile}
      />

      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Job Description"}
        </button>
        {error && <p className="text-rose-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Skills Found" value={result.total_skills_found} />
            <StatCard label="Experience" value={result.experience} accent="green" />
            <StatCard label="Education" value={result.education} accent="yellow" />
            <StatCard label="Priority Skills" value={result.priority_skills.length} accent="red" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Keyword Frequency</h3>
              <KeywordBarChart data={result.keyword_frequency} />
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Skill Category Distribution</h3>
              <SkillCategoryPie categorized={result.categorized_skills} />
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Top TF-IDF Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((k, i) => (
                <span key={i} className="badge">{k.keyword} ({k.score})</span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">All Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((s, i) => (
                  <span key={i} className="badge">{s}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Priority Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.priority_skills.map((s, i) => (
                  <span key={i} className="badge bg-amber-500/20 text-amber-300 border-amber-500/30">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
