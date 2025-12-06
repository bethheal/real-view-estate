import { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { toast } from "react-toastify";

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentProperties();
  }, []);

  const fetchAgentProperties = async () => {
    try {
      const res = await api.get("/agent/my-properties");
      setProperties(res.data);
    } catch (err) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      await api.delete(`/agent/property/${id}`);
      toast.success("Property deleted");
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
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
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Manage My Properties
      </h2>

      {properties.length === 0 ? (
        <p className="text-gray-600 text-center p-6">
          No properties uploaded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-b">
                  {/* IMAGE */}
                  <td className="p-3">
                    <img
                      src={p.images?.[0]}
                      alt="property"
                      className="w-20 h-16 object-cover rounded"
                    />
                  </td>

                  {/* TITLE */}
                  <td className="p-3 font-medium">{p.title}</td>

                  {/* TYPE */}
                  <td className="p-3 capitalize">{p.type}</td>

                  {/* PRICE */}
                  <td className="p-3">₵ {p.price.toLocaleString()}</td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>

                    {p.status === "rejected" && p.rejectionReason && (
                      <p className="text-red-600 text-xs mt-1">
                        Reason: {p.rejectionReason}
                      </p>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => window.location.href = `/agent/edit-property/${p._id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProperty(p._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => window.location.href = `/property/${p._id}`}
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-black"
                    >
                      View
                    </button>
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
