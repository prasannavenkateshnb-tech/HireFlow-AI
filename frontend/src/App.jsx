import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import JDAnalyzer from "./pages/JDAnalyzer";
import ResumeMatcher from "./pages/ResumeMatcher";
import SkillGap from "./pages/SkillGap";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jd-analyzer" element={<JDAnalyzer />} />
        <Route path="/resume-matcher" element={<ResumeMatcher />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}
