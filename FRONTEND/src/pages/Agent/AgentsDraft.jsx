import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../config/axios";

export default function AgentDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");

        const normalized = res.data.data.map((p) => ({
          ...p,
          status: "PENDING",
        }));

        setDrafts(normalized);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      await api.delete(`/properties/${id}`);
      setDrafts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;
  if (error) return <div className="p-12 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Properties ({drafts.length})</h1>
        <Link to="/agent/add-property" className="bg-black text-white px-4 py-2 rounded">
          + Add Property
        </Link>
      </header>

      {drafts.map((p) => (
        <div key={p.id} className="flex bg-white shadow rounded mb-4 overflow-hidden">
          <div className="w-64 h-40 relative">
            <img
              src={p.images?.[0] || "https://via.placeholder.com/300"}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 flex-1">
            <h2 className="font-bold text-lg">{p.title}</h2>
            <p className="text-sm text-gray-500">📍 {p.location}</p>
            <p className="text-orange-500 font-bold mt-2">
              GH₵ {Number(p.price).toLocaleString()}
            </p>

            <div className="mt-4 flex gap-3">
              <button className="border px-3 py-1 rounded">Edit</button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
