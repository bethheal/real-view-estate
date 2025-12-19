import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleInquiry = async () => {
    const res = await api.post('/inquire', {
        propertyId,
        buyerName,
        buyerPhone,
        message
    });

    // Directly send them to WhatsApp
    const whatsappMsg = `Hi, I'm interested in ${res.data.propertyTitle}. ${message}`;
    window.open(`https://wa.me/${res.data.agentPhone}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
};
  useEffect(() => {
    // Note: Adjusted path to match backend
    api.get(`/properties/admin/${id}`).then(res => setProperty(res.data));
  }, [id]);

  async function handleReview(action) {
    if (action === "REJECTED" && !rejectReason) return alert("Provide a reason");

    try {
      await api.patch(`/properties/${id}/review`, { 
        action: action, 
        reason: rejectReason 
      });
      alert(`Property ${action.toLowerCase()}!`);
      navigate("/admin/properties");
    } catch (err) {
      alert("Review failed to update.");
    }
  }

  if (!property) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black">
        <ArrowLeft size={18} /> Back to List
      </button>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          {/* FIXED: property.unitName */}
          <h2 className="text-2xl font-bold">Review: {property.unitName}</h2>
          <span className="bg-orange-100 text-[#ed7d31] px-4 py-1 rounded-full text-xs font-bold uppercase">
            {property.status}
          </span>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          <div className="grid grid-cols-2 gap-2">
            {/* FIXED: img.url */}
            {property.images.map((img, i) => (
              <img key={i} src={img.url} className="rounded-lg h-40 w-full object-cover shadow-sm" alt="Property" />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase">Description</h3>
              <p className="text-gray-700">{property.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                <p className="font-medium">{property.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                <p className="font-medium text-[#ed7d31]">GH₵ {property.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t space-y-4">
          <textarea
            placeholder="Rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            rows="3"
          />
          <div className="flex gap-4">
            <button onClick={() => handleReview("APPROVED")} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
              <CheckCircle size={20} /> Approve
            </button>
            <button onClick={() => handleReview("REJECTED")} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
              <XCircle size={20} /> Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}