import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../config/axios";

export default function AdminPropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => setProperty(res.data));
  }, [id]);

  const handleAction = async (action) => {
    try {
      await api.patch(`/admin/properties/${id}/review`, { action });
      alert(`Property has been ${action}`);
      navigate("/admin/pending"); // Go back to the list
    } catch (err) {
      alert("Error processing request");
    }
  };

  if (!property) return <div className="p-8">Loading details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-gray-500 hover:text-black">← Back</button>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Gallery Preview */}
        <div className="grid grid-cols-2 gap-2 h-64 bg-gray-100">
          {property.images.map((img, idx) => (
            <img key={idx} src={img.url} alt="property" className="w-full h-full object-cover" />
          ))}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.unitName}</h1>
              <p className="text-gray-500">📍 {property.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Requested Price</p>
              <p className="text-2xl font-bold text-[#F37A2A]">GH₵ {property.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700 border-t pt-6">
            <p><strong>Type:</strong> {property.propertyType} ({property.type})</p>
            <p><strong>Dimensions:</strong> {property.dimensions}</p>
            <p><strong>Description:</strong> {property.description}</p>
            <p><strong>Agent:</strong> {property.owner?.name} ({property.owner?.email})</p>
          </div>

          {/* Admin Decision Box */}
          <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 flex gap-4">
            <button 
              onClick={() => handleAction("APPROVED")}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Approve Listing
            </button>
            <button 
              onClick={() => handleAction("REJECTED")}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition"
            >
              Reject / Request Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}