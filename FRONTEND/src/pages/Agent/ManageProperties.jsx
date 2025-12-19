import { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// ------------------ DUMMY DATA ------------------
const fetchAgentProperties = async () => {
    try {
        const res = await api.get(`/agent/my-properties?agentId=${currentAgentId}`);
        setProperties(res.data);
        setLoading(false);
    } catch (err) {
        toast.error("Error loading properties");
    }
};
// ------------------------------------------------

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentProperties();
  }, []);

  const fetchAgentProperties = async () => {
    setTimeout(() => {
      setProperties(DUMMY_PROPERTIES_DATA);
      setLoading(false);
    }, 500);
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    toast.success(`Property ${id} deleted (DUMMY)`);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "rejected":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  if (loading)
    return (
      <p className="text-center p-6 text-gray-600 text-lg animate-pulse">
        Loading...
      </p>
    );

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        🏠 Manage Property Listings
      </h2>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <Link
          to="/agent/add-property"
          className="px-5 py-2 bg-[#F37A2A] text-white text-sm md:text-base rounded-lg hover:bg-orange-600 transition"
        >
          + Add New Property
        </Link>

        <Link
          to="/agent/drafts"
          className="px-5 py-2 text-sm md:text-base text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          View Drafts & Pending
        </Link>
      </div>

      {/* TABLE */}
      {properties.length === 0 ? (
        <p className="text-gray-600 text-center p-6 bg-gray-50 rounded-lg">
          No properties uploaded yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Leads
                </th>
                <th className="p-3 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50 transition duration-100"
                >
                  {/* IMAGE */}
                  <td className="p-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="w-20 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/80x64/E0E0E0?text=N/A";
                      }}
                    />
                  </td>

                  {/* TITLE */}
                  <td className="p-3 font-medium text-gray-900">{p.title}</td>

                  {/* TYPE */}
                  <td className="p-3 capitalize text-gray-600">{p.type}</td>

                  {/* PRICE */}
                  <td className="p-3 font-semibold text-gray-800">
                    ₵ {p.price.toLocaleString()}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>

                    {p.status === "rejected" && p.rejectionReason && (
                      <p className="text-red-600 text-xs mt-1 italic max-w-xs">
                        Reason: {p.rejectionReason}
                      </p>
                    )}
                  </td>

                  {/* LEADS */}
                  <td className="p-3">
                    <Link
                      to={`/agent/leads/${p._id}`}
                      className={`font-bold text-sm underline hover:no-underline transition 
                        ${
                          p.leadCount > 0
                            ? "text-[#F37A2A]"
                            : "text-gray-400 cursor-default"
                        }`}
                    >
                      {p.leadCount || 0} Leads
                    </Link>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="p-3 flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/agent/edit-property/${p._id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition w-full sm:w-auto text-center"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProperty(p._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition w-full sm:w-auto"
                    >
                      Delete
                    </button>

                    <Link
                      to={`/property/${p._id}`}
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-black transition w-full sm:w-auto text-center"
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
