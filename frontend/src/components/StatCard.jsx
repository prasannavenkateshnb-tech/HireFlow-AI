export default function StatCard({ label, value, suffix = "", accent = "primary" }) {
  const colors = {
    primary: "text-primary-400",
    green: "text-emerald-400",
    red: "text-rose-400",
    yellow: "text-amber-400",
  };
  return (
    <div className="card text-center">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors[accent] || colors.primary}`}>
        {value}
        {suffix}
      </p>
    </div>
  );
}
