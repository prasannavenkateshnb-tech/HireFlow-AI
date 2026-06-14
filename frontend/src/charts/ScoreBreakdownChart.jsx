import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ScoreBreakdownChart({ breakdown }) {
  if (!breakdown) return null;

  const data = [
    { name: "Skills", value: breakdown.skills_match },
    { name: "Experience", value: breakdown.experience_match },
    { name: "Education", value: breakdown.education_match },
    { name: "Keyword Coverage", value: breakdown.keyword_coverage },
    { name: "Text Similarity", value: breakdown.text_similarity },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" domain={[0, 100]} />
        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
        <Bar dataKey="value" fill="#22d3ee" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
