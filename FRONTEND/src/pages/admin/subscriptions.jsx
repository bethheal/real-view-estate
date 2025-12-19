import { useEffect, useState } from "react";
import { api } from "../../config/axios";

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api.get("/admin/subscriptions").then(res => setSubs(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#ed7d31] mb-6">Subscription Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left border-b text-gray-600 text-xs font-bold uppercase">
              <th className="p-4">Agent Name</th>
              <th className="p-4">Plan Level</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subs.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{s.agentName}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    s.plan === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {s.plan}
                  </span>
                </td>
                <td className="p-4 text-gray-600 font-mono">
                  {new Date(s.expires).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm">
                  {new Date(s.expires) > new Date() ? (
                    <span className="text-green-600 font-bold">● Active</span>
                  ) : (
                    <span className="text-red-600 font-bold">● Expired</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}