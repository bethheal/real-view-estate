import { useEffect, useState } from "react";
import { api } from "../../config/axios";

export default function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    api.get("/admin/agents").then(res => setAgents(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Agents</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(a => (
            <tr key={a._id} className="border-b">
              <td className="p-3">{a.firstName} {a.lastName}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
