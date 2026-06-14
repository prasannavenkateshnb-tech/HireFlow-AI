import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/jd-analyzer", label: "JD Analyzer" },
  { to: "/resume-matcher", label: "Resume Matcher" },
  { to: "/skill-gap", label: "Skill Gap" },
  { to: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary-400">AI</span> ATS Analyzer
        </div>
        <div className="flex gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-slate-300 hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
