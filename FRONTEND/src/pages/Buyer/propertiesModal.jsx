import { X, Phone, Mail, MessageCircle } from "lucide-react";
import { api } from "../../config/axios"; // Import your axios instance
import { toast } from "react-toastify";

export default function PropertyDetailsModal({ property, onClose }) {
  if (!property) return null;

  // Function to notify backend that the agent was contacted
  const handleContactClick = async () => {
    try {
      await api.post(`/properties/${property.id}/inquiry`);
      // We don't necessarily need to show a success toast here 
      // unless you want the buyer to know their interest was logged.
    } catch (err) {
      console.error("Could not log lead", err);
    }
  };
  const agent = property.agent || {
    name: "Unknown Agent",
    phone: "N/A",
    email: "N/A",
    avatar: "/no-avatar.png",
    businessName: "Real View Agent",
  };

  return (
   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-3xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{property.title}</h2>

        {/* Image */}
        <img
          src={property.images?.[0]}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        {/* Price */}
        <p className="text-xl font-semibold text-gray-800 mb-3">
          ₵ {property.price.toLocaleString()}
        </p>

        {/* Status */}
        <span className="px-3 py-1 rounded-full bg-gray-100 capitalize mb-4 inline-block">
          {property.status}
        </span>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Description</h3>
          <p className="text-gray-700 mt-1">
            {property.description || "No description given."}
          </p>
        </div>

        {/* Agent Contact */}
       <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-bold mb-3">Contact Agent</h3>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={agent.avatar}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{agent.name}</p>
              <p className="text-gray-500 text-sm">{agent.businessName}</p>
            </div>
          </div>

          <div className="space-y-2">
            <a 
              href={`tel:${agent.phone}`} 
              onClick={handleContactClick}
              className="flex items-center gap-2 text-blue-600"
            >
              <Phone size={16} /> {agent.phone}
            </a>

            <a 
              href={`mailto:${agent.email}`} 
              onClick={handleContactClick}
              className="flex items-center gap-2 text-green-600"
            >
              <Mail size={16} /> {agent.email}
            </a>

            <a
              href={`https://wa.me/${agent.phone}`}
              onClick={handleContactClick}
              className="flex items-center gap-2 text-green-500"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> WhatsApp Agent
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}