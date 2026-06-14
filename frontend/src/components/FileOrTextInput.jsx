import { useState } from "react";

export default function FileOrTextInput({ label, onFileChange, onTextChange, accept = ".pdf,.docx,.txt" }) {
  const [mode, setMode] = useState("text");
  const [fileName, setFileName] = useState("");

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-100">{label}</h3>
        <div className="flex gap-1 bg-slate-900/60 rounded-lg p-1">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === "text" ? "bg-primary-600 text-white" : "text-slate-400"}`}
            onClick={() => setMode("text")}
          >
            Paste Text
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === "file" ? "bg-primary-600 text-white" : "text-slate-400"}`}
            onClick={() => setMode("file")}
          >
            Upload File
          </button>
        </div>
      </div>

      {mode === "text" ? (
        <textarea
          className="input-field h-48 resize-none"
          placeholder={`Paste ${label.toLowerCase()} text here...`}
          onChange={(e) => onTextChange(e.target.value)}
        />
      ) : (
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files[0];
              setFileName(f?.name || "");
              onFileChange(f);
            }}
          />
          <span className="text-slate-400 text-sm">
            {fileName || `Click to upload (${accept})`}
          </span>
        </label>
      )}
    </div>
  );
}
