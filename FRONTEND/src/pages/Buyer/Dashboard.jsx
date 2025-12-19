import React, { useEffect, useState } from "react";
import { Heart, CalendarDays, TrendingUp, MapPin } from "lucide-react";
import { api } from "../../config/axios"; 
import { toast } from "react-toastify";

export default function BuyerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/buyer/stats");
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Dashboard...</div>;
  if (!data) return <div className="p-10 text-center">No data found.</div>;

  return (
    <div className="space-y-10 p-4">
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Heart size={28}/>} label="Saved Properties" count={data.savedCount} color="bg-orange-100 text-[#F37A2A]" />
        <StatCard icon={<CalendarDays size={28}/>} label="Viewing Requests" count={data.viewingCount} color="bg-green-100 text-green-600" />
        <StatCard icon={<TrendingUp size={28}/>} label="Recommendations" count={data.recommendationCount} color="bg-blue-100 text-blue-600" />
      </div>

      {/* 2. RECOMMENDED SECTION */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recommended For You</h2>
          <button className="text-[#F37A2A] text-sm font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.recommendations.map((prop) => (
            <div key={prop.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={prop.images?.[0]?.url || "/house-placeholder.png"} className="h-40 w-full object-cover" alt="property" />
              <div className="p-4">
                <h3 className="font-semibold truncate">{prop.unitName}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> {prop.location}</p>
                <p className="text-[#F37A2A] font-bold mt-2">₵ {prop.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TWO COLUMN LAYOUT: SAVED & VIEWINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Saved */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Recently Saved</h2>
          <div className="space-y-4">
            {data.recentSaved.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                <img src={item.property.images?.[0]?.url} className="w-16 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.property.unitName}</p>
                  <p className="text-gray-400 text-xs">{item.property.location}</p>
                </div>
                <button className="text-[#F37A2A] text-xs font-bold">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Viewings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Upcoming Viewings</h2>
          <div className="space-y-4">
            {data.upcomingViewings.map((v) => (
              <div key={v.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                <div>
                  <p className="font-semibold text-sm">{v.property.unitName}</p>
                  <p className="text-gray-400 text-xs">{v.property.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-sm">{new Date(v.date).toLocaleDateString()}</p>
                  <p className="text-gray-400 text-xs">{v.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Component
function StatCard({ icon, label, count, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
}