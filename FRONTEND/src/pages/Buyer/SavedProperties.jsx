import React from "react";

export default function SavedProperties({ savedProperties }) {
  if (!savedProperties || savedProperties.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">No saved properties yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedProperties.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-2xl shadow-sm overflow-hidden"
        >
          <img
            src={item.img}
            alt={item.title}
            className="h-52 w-full object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.location}</p>
            <p className="text-[#F37A2A] font-bold mt-2">
              ₵ {item.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
