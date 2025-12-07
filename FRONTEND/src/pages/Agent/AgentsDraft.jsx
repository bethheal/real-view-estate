import React, { useState, useEffect } from 'react';
// 1. IMPORTANT: Ensure you have 'react-router-dom' installed 
//    and import the Link component for smooth internal navigation.
import { Link } from 'react-router-dom'; 
// import { api } from "../../config/axios"; // Import your API client

// --- Dummy Data (Replace this with your actual API fetch) ---
const DRAFT_PROPERTIES_DATA = [
    {
        id: "prop-1234",
        agentId: "user-agent",
        status: "PENDING",
        createdAt: "2025-12-06T19:30:00.000Z",
        details: {
            unitName: "The Lakeside Duplex",
            propertyType: "House",
            transactionType: "Sale",
            location: "Accra, East Legon",
            dimensions: "2,800 sqft",
            price: 1500000.00,
            currency: "GHS"
        },
        images: [
            { url: "https://via.placeholder.com/224x160/F37A2A/FFFFFF?text=Draft+House+1", isPrimary: true },
        ],
        bedrooms: 4,
        bathrooms: 3
    },
    {
        id: "prop-5678",
        agentId: "user-agent",
        status: "DRAFT", // Example of an item that was saved but never formally submitted
        createdAt: "2025-12-05T10:00:00.000Z",
        details: {
            unitName: "Studio Apartment near Airport",
            propertyType: "Apartment",
            transactionType: "Rent",
            location: "Accra, Airport Residential Area",
            dimensions: "450 sqft",
            price: 4500.00,
            currency: "GHS"
        },
        images: [
            { url: "https://via.placeholder.com/224x160/F37A2A/FFFFFF?text=Draft+Apt+2", isPrimary: true },
        ],
        bedrooms: 1,
        bathrooms: 1
    },
    {
        id: "prop-9012",
        agentId: "user-agent",
        status: "REJECTED", // Example of a rejected listing
        createdAt: "2025-12-04T12:00:00.000Z",
        details: {
            unitName: "Coastal Land Parcel",
            propertyType: "Land",
            transactionType: "Sale",
            location: "Kasoa, Central Region",
            dimensions: "5 acres",
            price: 250000.00,
            currency: "GHS"
        },
        images: [
            { url: "https://via.placeholder.com/224x160/F37A2A/FFFFFF?text=Rejected+Land+3", isPrimary: true },
        ],
        bedrooms: 0,
        bathrooms: 0
    },
];

// --- Helper Functions for UI ---

// Returns a styled badge based on the property status
const getStatusBadge = (status) => {
    switch (status) {
        case 'PENDING':
            return <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Under Review</span>;
        case 'DRAFT':
            return <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Draft</span>;
        case 'REJECTED':
            return <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Rejected</span>;
        case 'APPROVED':
            // Should theoretically not show here, but good practice
            return <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>;
        default:
            return <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">{status}</span>;
    }
};

// --- Main Component ---

export default function AgentDrafts() {
    const [drafts, setDrafts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Using dummy data directly for simplicity since the fetch is commented out
    useEffect(() => {
        // In a real application, you would make an API call here:
        // api.get('/agent/properties/drafts')
        
        setTimeout(() => {
             setDrafts(DRAFT_PROPERTIES_DATA);
             setIsLoading(false);
        }, 500);
       
    }, []);

    const handleEdit = (id) => {
        // In a real app, use useNavigate or Link to='/agent/add-property/edit/:id'
        alert(`Navigating to edit property: ${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to permanently delete this draft?")) {
            // In a real app, call the API to delete the draft
            setDrafts(drafts.filter(draft => draft.id !== id));
            alert(`Draft ${id} deleted.`);
        }
    };

    // --- Loading and Error States ---
    if (isLoading) {
        return <div className="text-center p-12 text-gray-600">Loading drafts...</div>;
    }
    if (error) {
        return <div className="text-center p-12 text-red-600 border border-red-300 bg-red-50 rounded-lg">{error}</div>;
    }
    

    // --- Render Draft List ---
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="mb-8 flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    📝 My Property Drafts & Pending Listings ({drafts.length})
                </h1>
                {/* 2. FIX: Use Link to prevent full page refresh/logout */}
                <Link to="/agent/add-property" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-150">
                    + Add New Property
                </Link>
            </header>

            <div className="space-y-6">
                {drafts.length === 0 ? (
                     <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Drafts Found</h2>
                        <p className="text-gray-500">You haven't saved or submitted any properties yet.</p>
                        {/* 3. FIX: Use Link here too */}
                        <Link to="/agent/add-property" className="mt-4 inline-block px-4 py-2 bg-[#F37A2A] text-white rounded-lg hover:bg-orange-500">
                            Start Adding a Property
                        </Link>
                    </div>
                ) : (
                    drafts.map((property) => (
                        <div key={property.id} className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
                            
                            {/* Image Thumbnail */}
                            <div className="w-full md:w-56 flex-shrink-0">
                                <img
                                    src={property.images[0]?.url || "https://via.placeholder.com/224x160/E5E7EB?text=No+Image"}
                                    alt={property.details.unitName}
                                    className="w-full h-40 md:h-full object-cover"
                                />
                            </div>

                            {/* Details and Status */}
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-800">{property.details.unitName}</h2>
                                        {getStatusBadge(property.status)}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{property.details.location}</p>
                                    
                                    {/* Key Metrics */}
                                    <div className="flex space-x-6 text-sm text-gray-600">
                                        <p>🏠 {property.details.propertyType}</p>
                                        <p>📐 {property.details.dimensions}</p>
                                        <p>🛏️ {property.bedrooms || '?'}</p>
                                        <p>🛁 {property.bathrooms || '?'}</p>
                                    </div>
                                </div>
                                
                                {/* Price and Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-2xl font-extrabold text-[#F37A2A]">
                                        {property.details.currency} {property.details.price.toLocaleString()}
                                    </span>
                                    
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleEdit(property.id)}
                                            className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:text-red-800 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}