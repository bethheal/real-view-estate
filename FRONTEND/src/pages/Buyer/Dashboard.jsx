import React from "react";
import { Heart, Home, CalendarDays, TrendingUp } from "lucide-react";

export default function BuyerDashboard() {
  return (
    <div className="space-y-10">

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Saved Properties */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-orange-100 text-[#F37A2A] flex items-center justify-center">
            <Heart size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Saved Properties</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

        {/* Viewing Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <CalendarDays size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Viewing Requests</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">New Recommendations</p>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>

      </div>

      {/* RECOMMENDED FOR YOU */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recommended For You</h2>
          <button className="text-[#F37A2A] text-sm font-medium hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="h-40 bg-gray-200 rounded-t-xl"></div>
              <div className="p-4">
                <h3 className="font-semibold">Luxury 2 Bedroom Apartment</h3>
                <p className="text-gray-500 text-sm mt-1">Airport Residential Area</p>
                <p className="text-[#F37A2A] font-bold mt-2">$850 / month</p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* RECENT SAVED PROPERTIES */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Saved</h2>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-20 h-16 bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <p className="font-semibold">Modern Studio Apartment</p>
                <p className="text-gray-500 text-sm">East Legon</p>
              </div>
              <button className="text-[#F37A2A] hover:underline text-sm">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING VIEWINGS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Viewing Requests</h2>

        <div className="space-y-4">

          {[1, 2].map((i) => (
            <div 
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">2 Bedroom Apartment</p>
                <p className="text-gray-500 text-sm">Spintex Road</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-800">Feb 12, 2025</p>
                <p className="text-gray-500 text-sm">3:00 PM</p>
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
