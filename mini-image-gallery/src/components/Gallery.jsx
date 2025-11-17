import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, ImageOff } from "lucide-react";

function Thumb({ id, filename, onDelete }) {
  const [src, setSrc] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;
    setLoading(true);
    setErr(false);

    const url = `http://localhost:4000/images/${id}/thumbnail`;
    const img = new Image();

    img.onload = () => {
      if (aborted) return;
      setSrc(url);
      setLoading(false);
    };

    img.onerror = () => {
      if (aborted) return;
      setErr(true);
      setLoading(false);
    };

    img.src = url;

    return () => (aborted = true);
  }, [id]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col"
    >
      {/* Image container */}
      <div className="relative w-full pb-[75%] rounded-md overflow-hidden bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <div className="w-16 h-3 bg-gray-300 rounded-full" />
          </div>
        )}

        {!loading && !err && src && (
          <img
            src={src}
            alt={filename}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {!loading && err && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageOff size={32} />
            <p className="text-xs mt-1">Image failed</p>
          </div>
        )}
      </div>

      {/* Filename + Delete */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm font-medium truncate max-w-[70%]">{filename}</p>

        <button
          onClick={() => onDelete(id)}
          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);

  const loadImages = async () => {
    setLoadingList(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/images");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load images");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadImages();
    const handler = () => loadImages();
    window.addEventListener("galleryUpdate", handler);
    return () => window.removeEventListener("galleryUpdate", handler);
  }, []);

  const deleteImage = async (id) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(`http://localhost:4000/images/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      loadImages();
    } catch (err) {
      console.error(err);
      alert("Failed to delete image");
    }
  };

  if (loadingList)
    return (
      <p className="text-gray-600 mt-3 animate-pulse">Loading images...</p>
    );

  if (error)
    return <p className="text-red-600 font-medium mt-3">{error}</p>;

  if (!images.length)
    return (
      <p className="opacity-60 text-gray-500 mt-3">
        No images uploaded yet.
      </p>
    );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Gallery</h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
        {images.map((img) => (
          <Thumb
            key={img.id}
            id={img.id}
            filename={img.filename}
            onDelete={deleteImage}
          />
        ))}
      </div>
    </div>
  );
}
