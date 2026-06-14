import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function KeywordBarChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-slate-500 text-sm">No keyword data available.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis type="number" stroke="#94a3b8" />
        <YAxis
          type="category"
          dataKey={data[0]?.word ? "word" : "keyword"}
          stroke="#94a3b8"
          width={100}
        />
        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
        <Bar dataKey={data[0]?.count !== undefined ? "count" : "score"} fill="#6366f1" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
