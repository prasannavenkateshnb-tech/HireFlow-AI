import axios from "axios";

const api = axios.create({
  baseURL: "https://hireflow-ai-production.up.railway.app/api",
});

export const analyzeJD = (payload) => {
  const form = new FormData();

  if (payload.file) form.append("file", payload.file);
  if (payload.text) form.append("text", payload.text);

  return api.post("/analyze-jd", form);
};

export const matchResume = ({
  resumeText,
  jdText,
  resumeFile,
  jdFile,
}) => {
  const form = new FormData();

  if (resumeText) form.append("resume_text", resumeText);
  if (jdText) form.append("jd_text", jdText);
  if (resumeFile) form.append("resume_file", resumeFile);
  if (jdFile) form.append("jd_file", jdFile);

  return api.post("/match-resume", form);
};

export const skillGap = ({
  resumeText,
  jdText,
  resumeFile,
  jdFile,
}) => {
  const form = new FormData();

  if (resumeText) form.append("resume_text", resumeText);
  if (jdText) form.append("jd_text", jdText);
  if (resumeFile) form.append("resume_file", resumeFile);
  if (jdFile) form.append("jd_file", jdFile);

  return api.post("/skill-gap", form);
};

export const summarizeResume = (payload) => {
  const form = new FormData();

  if (payload.file) form.append("file", payload.file);
  if (payload.text) form.append("text", payload.text);

  return api.post("/summarize-resume", form);
};

export const getAnalytics = () => api.get("/analytics");

export default api;