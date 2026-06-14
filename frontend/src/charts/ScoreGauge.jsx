import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function ScoreGauge({
  score = 0,
  label = "ATS Match Score",
}) {
  const data = [
    {
      name: "score",
      value: score,
      fill:
        score >= 70
          ? "#10b981"
          : score >= 40
          ? "#f59e0b"
          : "#f43f5e",
    },
  ];

  return (
    <div className="relative w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={18}
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            background
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Center Score */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-white">
          {score}%
        </span>
      </div>

      {/* Label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}