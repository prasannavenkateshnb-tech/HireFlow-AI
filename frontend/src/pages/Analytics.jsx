import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import KeywordBarChart from "../charts/KeywordBarChart";
import { getAnalytics } from "../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-10"><p className="text-slate-400">Loading analytics...</p></div>;
  if (error) return <div className="max-w-7xl mx-auto px-6 py-10"><p className="text-rose-400">{error}</p></div>;

  const skillChartData = (data.most_requested_skills || []).map((s) => ({ word: s.skill, count: s.count }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-slate-400">Overview of all analyzed job descriptions, resumes, and ATS reports.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Job Descriptions" value={data.total_jds} />
        <StatCard label="Resumes" value={data.total_resumes} accent="green" />
        <StatCard label="Reports Generated" value={data.total_reports} accent="yellow" />
        <StatCard label="Avg. Match Score" value={data.average_match_score} suffix="%" accent="red" />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Most Requested Skills Across JDs</h3>
        <KeywordBarChart data={skillChartData} />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Recent Match Reports</h3>
        {data.recent_reports.length === 0 ? (
          <p className="text-slate-500 text-sm">No reports generated yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-left border-b border-white/10">
                <th className="py-2">Report ID</th>
                <th className="py-2">Match Score</th>
                <th className="py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_reports.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="py-2">#{r.id}</td>
                  <td className="py-2">{r.match_score}%</td>
                  <td className="py-2 text-slate-400">{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
