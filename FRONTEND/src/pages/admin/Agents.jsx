import { useEffect, useState } from "react";
import { api } from "../../config/axios";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/agents")
      .then(res => setAgents(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#ed7d31] mb-6">Registered Agents</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b">
              <th className="p-4">Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.map(a => (
              <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">{a.firstName} {a.lastName}</td>
                <td className="p-4 text-gray-600">{a.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {a.status || 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-[#ed7d31] hover:underline text-sm font-semibold">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && agents.length === 0 && (
          <div className="text-center py-10 text-gray-500">No agents found.</div>
        )}
      </div>
    </div>
  );
}