import React, { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import { Home, CheckCircle, Clock, XCircle, TrendingUp, Users } from "lucide-react";

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    monthlyLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/agent/dashboard-stats");
      setStats(res.data.stats);
      setRecentLeads(res.data.recentLeads);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Loading dashboard data...
      </div>
    );

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      
      {/* LEFT COLUMN (Main Stats & Table) */}
      <div className="flex-1 space-y-6">
        
        {/* 1. STATS ROW (Styled like 'Assets' in image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Properties */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                    <Home size={24} />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Properties</h3>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">{stats.totalProperties}</p>
            </div>

            {/* Approved */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                <div className="p-3 bg-green-50 text-green-600 rounded-full mb-3">
                    <CheckCircle size={24} />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Approved</h3>
                <p className="text-3xl font-extrabold text-green-600 mt-2">{stats.approved}</p>
            </div>

            {/* Pending */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full mb-3">
                    <Clock size={24} />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Pending</h3>
                <p className="text-3xl font-extrabold text-yellow-600 mt-2">{stats.pending}</p>
            </div>

            {/* Rejected */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3">
                    <XCircle size={24} />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Rejected</h3>
                <p className="text-3xl font-extrabold text-red-600 mt-2">{stats.rejected}</p>
            </div>
        </div>

        {/* 2. RECENT LEADS TABLE (Styled like 'Upcoming Contracts' list in image) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Recent Leads</h3>
            </div>
            
            <div className="p-4">
                {recentLeads.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No leads generated this month.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4 text-left rounded-l-lg">Name</th>
                                    <th className="px-6 py-4 text-left">Contact</th>
                                    <th className="px-6 py-4 text-left">Property</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left rounded-r-lg">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-orange-50/50 transition duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-800">{lead.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{lead.contact}</td>
                                        <td className="px-6 py-4 text-blue-600 font-medium">{lead.propertyTitle}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                                                ${lead.status === 'new' ? 'bg-green-100 text-green-700' : 
                                                  lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 
                                                  'bg-gray-100 text-gray-700'}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN (Styled like 'Overview for today' in image) */}
      <div className="w-full xl:w-80 space-y-6">
        
        {/* Monthly Leads Card (Styled as a feature block) */}
        <div className="bg-[#F37A2A] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-orange-200">
            {/* Background decoration */}
            <TrendingUp className="absolute top-4 right-4 text-white opacity-20 w-16 h-16" />
            
            <h3 className="text-orange-100 text-sm font-medium mb-1">Leads This Month</h3>
            <p className="text-4xl font-bold mb-4">{stats.monthlyLeads}</p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                <Users size={20} className="text-white" />
                <span className="text-sm font-medium">Potential Clients</span>
            </div>
        </div>

        {/* Placeholder for Quick Actions or Other Stats (To fill the sidebar visually) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Overview</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Properties Active</span>
                    <span className="font-bold text-gray-800">{stats.approved}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Processing</span>
                    <span className="font-bold text-orange-500">{stats.pending}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Leads</span>
                    <span className="font-bold text-gray-800">{stats.monthlyLeads}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AgentDashboard;