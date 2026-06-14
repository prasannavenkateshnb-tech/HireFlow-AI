import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function SkillGapRadar({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-slate-500 text-sm">No skill gap data available.</p>;
  }

  // Limit to top 10 for readability
  const limited = data.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={limited}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
        <PolarRadiusAxis domain={[0, 100]} stroke="#334155" />
        <Radar name="Resume" dataKey="resume" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
        <Radar name="Job Description" dataKey="jd" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
