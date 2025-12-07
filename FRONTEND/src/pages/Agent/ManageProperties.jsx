import { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom'; 

// --- DUMMY DATA FOR DEMONSTRATION (UPDATED WITH leadCount)---
const DUMMY_PROPERTIES_DATA = [
  {
    _id: "prop-live-1",
    title: "Luxury Duplex - Airport View",
    type: "Sale",
    price: 3500000.00,
    status: "approved",
    images: ["https://via.placeholder.com/150/008080/FFFFFF?text=Approved+1"],
    rejectionReason: null,
    leadCount: 5, // NEW: 5 leads for this property
  },
  {
    _id: "prop-pending-2",
    title: "1-Bedroom Apartment - Cantonments",
    type: "Rent",
    price: 7500.00,
    status: "pending",
    images: ["https://via.placeholder.com/150/FFD700/000000?text=Pending+2"],
    rejectionReason: null,
    leadCount: 0, // NEW: 0 leads
  },
  {
    _id: "prop-rejected-3",
    title: "Land Plot - Tema Industrial Area",
    type: "Sale",
    price: 180000.00,
    status: "rejected",
    images: ["https://via.placeholder.com/150/FF0000/FFFFFF?text=Rejected+3"],
    rejectionReason: "Missing land title document.",
    leadCount: 2, // NEW: 2 leads
  },
];
// --- END DUMMY DATA ---

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentProperties();
  }, []);

  // Simplified fetch for this example, using the dummy data
  const fetchAgentProperties = async () => {
    // In a real app: const res = await api.get("/agent/my-properties");
    setTimeout(() => {
      setProperties(DUMMY_PROPERTIES_DATA);
      setLoading(false);
    }, 500);
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    // Simulate API call for deletion
    toast.success(`Property ${id} deleted (DUMMY)`);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading)
    return <p className="text-center p-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        🏠 Live Property Listings
      </h2>

      <div className="mb-6 flex justify-between items-center">
          <Link 
              to="/agent/add-property" 
              className="px-4 py-2 bg-[#F37A2A] text-white text-sm rounded-lg hover:bg-orange-600 transition duration-150"
          >
              + Add New Property
          </Link>
          <Link 
              to="/agent/drafts" 
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
              View Drafts & Pending
          </Link>
      </div>


      {properties.length === 0 ? (
        <p className="text-gray-600 text-center p-6 bg-gray-50 rounded-lg">
          No approved properties uploaded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 text-sm font-semibold text-gray-700">Image</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Title</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Type</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Price</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
                {/* *** NEW COLUMN: Leads Count *** */}
                <th className="p-3 text-sm font-semibold text-gray-700">Leads</th> 
                <th className="p-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50 transition duration-100">
                  {/* IMAGE, TITLE, TYPE, PRICE, STATUS remain the same... */}
                  <td className="p-3">
                    <img
                      src={p.images?.[0]} 
                      alt={p.title}
                      className="w-20 h-16 object-cover rounded"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80x64/E0E0E0?text=N/A"; }}
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-900">{p.title}</td>
                  <td className="p-3 capitalize text-gray-600">{p.type}</td>
                  <td className="p-3 font-semibold text-gray-800">₵ {p.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                    {p.status === "rejected" && p.rejectionReason && (
                      <p className="text-red-600 text-xs mt-1 max-w-xs italic">
                        Reason: {p.rejectionReason}
                      </p>
                    )}
                  </td>
                  
                  {/* *** NEW COLUMN IMPLEMENTATION *** */}
                  <td className="p-3">
                      <Link
                          to={`/agent/leads/${p._id}`} // Link to the new Leads Detail page
                          className={`font-bold text-sm underline hover:no-underline transition 
                              ${p.leadCount > 0 ? 'text-[#F37A2A]' : 'text-gray-400 cursor-default'}`}
                      >
                          {p.leadCount || 0} Leads
                      </Link>
                  </td>
                  {/* *** END NEW COLUMN *** */}


                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">
                    <Link
                      to={`/agent/edit-property/${p._id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProperty(p._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                    
                    {/* The "View" button now links to the public facing page, not lead management */}
                    <Link
                      to={`/property/${p._id}`} 
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-black transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}