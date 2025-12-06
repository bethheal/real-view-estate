import { useEffect, useState } from "react";
import { api } from "../../config/axios";

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api.get("/admin/subscriptions").then(res => setSubs(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Subscriptions</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Agent</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Expires</th>
          </tr>
        </thead>

        <tbody>
          {subs.map((s) => (
            <tr key={s._id} className="border-b">
              <td className="p-3">{s.agentName}</td>
              <td className="p-3">{s.plan}</td>
              <td className="p-3">{new Date(s.expires).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
