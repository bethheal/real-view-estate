import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../config/axios";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    api.get(`/admin/properties/${id}`).then(res => {
      setProperty(res.data);
    });
  }, [id]);

  async function approve() {
    await api.post(`/admin/properties/${id}/approve`);
    alert("Property approved!");
    navigate("/admin/properties");
  }

  async function reject() {
    if (!rejectReason) return alert("Provide a rejection reason");

    await api.post(`/admin/properties/${id}/reject`, { reason: rejectReason });
    alert("Property rejected!");
    navigate("/admin/properties");
  }

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Review Property
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {property.images.map((img, i) => (
          <img
            src={img}
            key={i}
            className="rounded-lg shadow"
            alt="Property"
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold">{property.title}</h3>
        <p>{property.description}</p>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Dimensions:</strong> {property.dimensions}</p>
      </div>

      <div className="mt-8 flex gap-4">

        <button
          onClick={approve}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Approve
        </button>

        <button
          onClick={reject}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Reject
        </button>

      </div>

      {/* Reject reason */}
      <div className="mt-4">
        <textarea
          placeholder="Reason for rejection..."
          onChange={(e) => setRejectReason(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>
    </div>
  );
}
