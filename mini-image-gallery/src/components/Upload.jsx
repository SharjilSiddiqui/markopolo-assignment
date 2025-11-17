import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CloudUpload, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (f) => {
    if (!f) return "No file selected";
    if (!["image/jpeg", "image/png"].includes(f.type))
      return "Only JPEG and PNG allowed";
    if (f.size > 3 * 1024 * 1024) return "File size must be 3MB or less";
    return null;
  };

  const handleFile = (f) => {
    setStatus("");
    const err = validateFile(f);
    if (err) {
      setFile(null);
      setStatus("❌ " + err);
      return;
    }
    setFile(f);
    setStatus("Selected: " + f.name);
  };

  const onChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const doUpload = async () => {
    if (!file) {
      setStatus("❌ Please select an image first.");
      return;
    }

    const form = new FormData();
    form.append("image", file);
    setLoading(true);
    setProgress(0);
    setStatus("Uploading...");

    try {
      await axios.post("http://localhost:4000/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!e.lengthComputable) return;
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
        timeout: 30000,
      });

      setStatus("✅ Upload successful");
      setFile(null);
      setProgress(0);
      window.dispatchEvent(new Event("galleryUpdate"));
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Network error";
      setStatus("❌ Upload failed: " + msg);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Alert message styling
  const renderStatus = () => {
    if (!status) return null;

    let color = "bg-blue-100 text-blue-700 border-blue-300";
    let Icon = AlertTriangle;

    if (status.startsWith("❌")) {
      color = "bg-red-100 text-red-700 border-red-300";
      Icon = XCircle;
    } else if (status.startsWith("✅")) {
      color = "bg-green-100 text-green-700 border-green-300";
      Icon = CheckCircle;
    }

    return (
      <div
        className={`mt-4 flex items-center gap-2 p-3 rounded-lg border ${color}`}
      >
        <Icon size={20} />
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>

      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        whileHover={{ scale: 1.01 }}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white p-6 rounded-xl shadow-sm hover:border-blue-400 transition cursor-pointer"
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={onChange}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <CloudUpload size={48} className="text-blue-500 mb-3" />

          <p className="font-medium text-gray-700">
            {file ? file.name : "Drag & drop an image here or click to select"}
          </p>

          <p className="text-sm text-gray-500 mt-1">JPEG or PNG — max 3 MB</p>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={doUpload}
          disabled={loading}
          className={`px-5 py-2 rounded-lg shadow transition hover:scale-105 text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={() => {
            setFile(null);
            setStatus("");
          }}
          disabled={loading}
          className={`px-5 py-2 rounded-lg shadow transition hover:scale-105 ${
            loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Clear
        </button>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
              className="h-full bg-green-500"
            />
          </div>
          <small className="text-gray-600">{progress}%</small>
        </div>
      )}

      {/* Status message */}
      {renderStatus()}
    </div>
  );
}
