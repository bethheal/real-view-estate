import React, { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import { Home, CheckCircle, Clock, XCircle, TrendingUp, Users, Zap, BarChart2 } from "lucide-react";



const AgentDashboard = () => {
const [stats, setStats] = useState({
  totalProperties: 0,
  approved: 0,
  pending: 0,
  rejected: 0,
  monthlyLeads: 0
});

const [performanceData, setPerformanceData] = useState({
  labels: [],
  monthlyLeads: [],
  monthlyClosures: []
});

const [analysis, setAnalysis] = useState({
  leadConversionRate: 0,
  leadsPerProperty: 0,
  highestPerformingProperty: "—",
  lowPerformingProperties: 0
});

    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {
    const res = await api.get("/dashboard/agent/stats");

    setStats(res.data.stats);

    setRecentLeads(
      res.data.recentLeads.map(lead => ({
        _id: lead.id,
        name: lead.buyerName,
        contact: lead.buyerEmail || lead.buyerPhone,
        propertyTitle: lead.property.title,
        status: lead.status.toLowerCase(),
        createdAt: lead.createdAt
      }))
    );

    setLoading(false);
  } catch (err) {
    toast.error("Failed to load dashboard");
    setLoading(false);
  }
};

    
    // Helper function for the graph placeholder styling
    const getBarHeight = (value, max) => `${(value / max) * 100}%`;

    // Function to set status badge colors (copied from previous code)
    const getLeadStatusColor = (status) => {
        if (status === 'new') return 'bg-green-100 text-green-700';
        if (status === 'contacted') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
                Loading dashboard data...
            </div>
        );

    return (
        <div className="flex flex-col xl:flex-row gap-6">
            
            {/* LEFT COLUMN (Main Stats & Performance) */}
            <div className="flex-1 space-y-6">
                
                {/* 1. PROPERTY STATS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Properties */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3"><Home size={24} /></div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Properties</h3>
                        <p className="text-3xl font-extrabold text-gray-800 mt-2">{stats.totalProperties}</p>
                    </div>
                    {/* Approved */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-green-50 text-green-600 rounded-full mb-3"><CheckCircle size={24} /></div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Approved</h3>
                        <p className="text-3xl font-extrabold text-green-600 mt-2">{stats.approved}</p>
                    </div>
                    {/* Pending */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full mb-3"><Clock size={24} /></div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Pending</h3>
                        <p className="text-3xl font-extrabold text-yellow-600 mt-2">{stats.pending}</p>
                    </div>
                    {/* Rejected */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3"><XCircle size={24} /></div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide">Rejected</h3>
                        <p className="text-3xl font-extrabold text-red-600 mt-2">{stats.rejected}</p>
                    </div>
                </div>

                {/* 2. MONTHLY PERFORMANCE GRAPH (New Section) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <BarChart2 size={20} className="text-gray-600" />
                        <h3 className="text-lg font-bold text-gray-800">Monthly Performance Overview</h3>
                    </div>
                    
                    <div className="p-6">
                        {/* Placeholder for a Dual-Axis Bar/Line Chart */}
                        <div className="h-64 flex items-end justify-between gap-2 p-2 border-l border-b border-gray-200">
                            {performanceData.monthlyLeads.map((leads, index) => {
                                const closures = performanceData.monthlyClosures[index];
                                const maxLeads = Math.max(...performanceData.monthlyLeads);
                                
                                return (
                                    <div key={index} className="flex flex-col items-center h-full justify-end w-1/6 relative group">
                                        {/* Bar for Closures (Behind) */}
                                        <div 
                                            className="w-full bg-blue-300/50 absolute bottom-0" 
                                            style={{ height: getBarHeight(closures, maxLeads) }}
                                        ></div>
                                        {/* Bar for Leads (Front) */}
                                        <div 
                                            className="w-full bg-[#F37A2A] relative" 
                                            style={{ height: getBarHeight(leads, maxLeads) }}
                                        >
                                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800">
                                                {leads}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{performanceData.labels[index]}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end gap-4 mt-4 text-sm">
                            <span className="flex items-center gap-2 text-[#F37A2A] font-medium">
                                <span className="w-3 h-3 bg-[#F37A2A] rounded-full"></span> Leads
                            </span>
                            <span className="flex items-center gap-2 text-blue-500 font-medium">
                                <span className="w-3 h-3 bg-blue-300/50 rounded-full"></span> Closures (Approx.)
                            </span>
                        </div>
                        {/* Note: In a production environment, replace this div with a real charting library */}
                    </div>
                </div>

                {/* 3. RECENT LEADS TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Recent Leads</h3>
                    </div>
                    
                    <div className="p-4">
                        {recentLeads.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No leads generated recently.</div>
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
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getLeadStatusColor(lead.status)}`}>
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

            {/* RIGHT COLUMN (Monthly Leads Card & Analysis) */}
            <div className="w-full xl:w-80 space-y-6">
                
                {/* Monthly Leads Card */}
                <div className="bg-[#F37A2A] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-orange-200">
                    <TrendingUp className="absolute top-4 right-4 text-white opacity-20 w-16 h-16" />
                    <h3 className="text-orange-100 text-sm font-medium mb-1">Leads This Month</h3>
                    <p className="text-4xl font-bold mb-4">{stats.monthlyLeads}</p>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                        <Users size={20} className="text-white" />
                        <span className="text-sm font-medium">Potential Clients</span>
                    </div>
                </div>

                {/* Monthly Performance Analysis (New Card) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-orange-500" />
                        Monthly Performance Analysis
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                            <span className="text-gray-500">Lead Conversion Rate</span>
                            <span className="font-bold text-green-600">{analysis.leadConversionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                            <span className="text-gray-500">Avg. Leads per Property</span>
                            <span className="font-bold text-gray-800">{analysis.leadsPerProperty}</span>
                        </div>
                        <div className="flex flex-col text-sm border-b pb-2">
                            <span className="text-gray-500 mb-1">Top Performing Listing</span>
                            <span className="font-bold text-blue-600 text-xs truncate">{analysis.highestPerformingProperty}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Low/Stale Listings</span>
                            <span className="font-bold text-red-600">{analysis.lowPerformingProperties}</span>
                        </div>
                    </div>
                </div>
                
                {/* Quick Overview (Existing Card) */}
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
                            <span className="text-gray-500">Total Leads (All Time)</span>
                            <span className="font-bold text-gray-800">{stats.monthlyLeads}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AgentDashboard;