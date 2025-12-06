import { useState } from "react";
import { api } from "../../config/axios";

export default function AddProperty() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "house",
    price: "",
    location: "",
    dimensions: "",
  });

  const [images, setImages] = useState([]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    setImages([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await api.post("/agent/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property submitted for review!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload property");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#F37A2A]">
        Add New Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="font-medium">Property Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="font-medium">Property Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            rows="5"
            placeholder="Detailed description of the property..."
            required
          ></textarea>
        </div>

        {/* Dimensions */}
        <div>
          <label className="font-medium">Dimensions (sqft / acres)</label>
          <input
            type="text"
            name="dimensions"
            value={form.dimensions}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            placeholder="Example: 1200 sqft or 1.5 acres"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="font-medium">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload clear images. Admin will verify if it is a house or land.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full p-3 bg-[#F37A2A] text-white rounded-lg hover:bg-orange-500"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
}
