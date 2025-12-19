import React, { useState } from "react";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import PropertyDetailsModal from "./propertiesModal";

export default function BrowseProperties({savedProperties, setSavedProperties}) {
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const getProperties = async () => {
        const res = await api.get('/properties/browse');
        setProperties(res.data); // Update state from backend
    };
    getProperties();
}, []);

  // Inside BrowseProperties
  const toggleSave = (property) => {
    setSavedProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  // Fake Property List (Replace with your API later)
  const properties = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      title: "Luxury 2 Bedroom Apartment",
      location: "Airport Residential Area",
      price: 850000,
      beds: 2,
      baths: 2,
      description: "A luxurious 2 bedroom apartment with modern amenities.",
      status: "for rent",
      agent: {
        name: "John Doe",
        phone: "233501234567",
        email: "john@example.com",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        businessName: "Prime Real Estate",
      },
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
      ],
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      title: "Modern Studio Apartment",
      location: "East Legon",
      price: 500000,
      beds: 1,
      baths: 1,
      description: "A cozy studio in the heart of East Legon.",
      status: "for rent",
      agent: {
        name: "Jane Smith",
        phone: "233501234568",
        email: "jane@example.com",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        businessName: "Urban Living",
      },
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
    },
  ];

  return (
    <div className="space-y-10">
      {/* SEARCH + FILTER BAR */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full md:flex-1 border rounded-xl px-4 py-3 bg-gray-50">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search location, property type, or keywords..."
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      {/* PROPERTY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
            onClick={() => setSelectedProperty(item)}
          >
            {/* Image Area */}
            <div className="relative h-52 w-full">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover"
              />

              {/* Save Button */}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(item); // pass full property object
                }}
                className={`absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition ${
                  savedProperties.find((p) => p.id === item.id)
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                <Heart
                  size={20}
                  fill={
                    savedProperties.find((p) => p.id === item.id)
                      ? "red"
                      : "transparent"
                  }
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-2">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.location}</p>
              <p className="text-[#F37A2A] font-bold text-lg mt-3">
                ₵ {item.price.toLocaleString()}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-4 text-gray-600 text-sm mt-3">
                <span>{item.beds} Beds</span>
                <span>{item.baths} Baths</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROPERTY DETAILS MODAL */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
