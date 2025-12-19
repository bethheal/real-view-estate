import React, { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { Users, Clock, CreditCard, Activity } from "lucide-react";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ agents: 0, properties: 0, revenue: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats({
        agents: res.data.agents,
        properties: res.data.properties,
        revenue: res.data.revenue
      });
      setActivity(res.data.activity || []);
    } catch (err) {
      toast.error("Unauthorized or Server Error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 font-medium">Loading Admin Data...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Manage your agents and property approvals.</p>
      </div>
      
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Agents" 
          count={stats.agents} 
          icon={<Users size={24} />} 
          color="border-blue-500" 
        />
        <StatCard 
          title="Pending Reviews" 
          count={stats.properties} 
          icon={<Clock size={24} />} 
          color="border-orange-500" 
        />
        <StatCard 
          title="Active Subs" 
          count={stats.revenue} 
          icon={<CreditCard size={24} />} 
          color="border-green-500" 
        />
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex items-center gap-2 font-semibold text-gray-800">
          <Activity size={20} className="text-orange-500" />
          <h3>Recent Activity</h3>
        </div>
        <div className="p-0">
          {activity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Agent</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {activity.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.unitName}</td>
                      <td className="px-6 py-4 text-gray-600">{item.user?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 
                          item.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400">No recent property submissions.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENT
const StatCard = ({ title, count, icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} flex justify-between items-center`}>
    <div>
      <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
    </div>
    <div className="text-gray-300">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;