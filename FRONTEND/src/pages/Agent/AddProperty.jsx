import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/axios";

export default function AddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    unitName: "",
    description: "",
    price: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.unitName);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("location", form.location);

    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/agent/drafts");
    } catch (err) {
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white shadow rounded"
    >
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>

      <input
        name="unitName"
        placeholder="Property Title"
        className="w-full border p-2 mb-3"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border p-2 mb-3"
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        className="w-full border p-2 mb-3"
        onChange={handleChange}
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        className="w-full border p-2 mb-3"
        onChange={handleChange}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
        className="mb-4"
      />

      <button
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Property"}
      </button>
    </form>
  );
}
