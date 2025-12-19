import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

import { api } from "../../config/axios"; // Your axios instance


// --- Main Component ---
export default function AgentDrafts() {
    const [drafts, setDrafts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

useEffect(() => {
    const fetchDrafts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/properties/drafts');
            setDrafts(response.data);
        } catch (err) {
            setError("Could not load your drafts. Please try again later.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchDrafts();
}, []);
const handleDelete = async (id) => {
        if (window.confirm("Delete this property permanently?")) {
            try {
                await api.delete(`/properties/${id}`);
                setDrafts(prev => prev.filter(item => item.id !== id));
            } catch (err) {
                alert("Could not delete. Try again.");
            }
        }
    };

// --- Helper Functions ---
const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
    switch (status) {
        case 'PENDING':
            return <span className={`${baseClasses} text-yellow-800 bg-yellow-200`}>Under Review</span>;
        case 'DRAFT':
            return <span className={`${baseClasses} text-gray-800 bg-gray-200`}>Draft</span>;
        case 'REJECTED':
            return <span className={`${baseClasses} text-red-800 bg-red-200`}>Rejected</span>;
        case 'APPROVED':
            return <span className={`${baseClasses} text-green-800 bg-green-200`}>Approved</span>;
        default:
            return <span className={`${baseClasses} text-blue-800 bg-blue-200`}>{status}</span>;
    }
};
    useEffect(() => {
        setTimeout(() => {
             setDrafts(DRAFT_PROPERTIES_DATA);
             setIsLoading(false);
        }, 500);
    }, []);

    const handleEdit = (id) => {
        alert(`Navigating to edit property: ${id}`);
    };

    
    if (isLoading) {
        return <div className="text-center p-12 text-gray-600 animate-pulse">Loading drafts...</div>;
    }
    if (error) {
        return <div className="text-center p-12 text-red-600 border border-red-300 bg-red-50 rounded-lg">{error}</div>;
    }
    
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Header: Stacks on mobile, Row on desktop */}
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    📝 My Drafts <span className="text-gray-500 font-medium text-lg">({drafts.length})</span>
                </h1>
                
                <Link 
                    to="/agent/add-property" 
                    className="w-full sm:w-auto text-center px-4 py-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-150 shadow-sm"
                >
                    + Add New Property
                </Link>
            </header>

            <div className="space-y-6">
                {drafts.length === 0 ? (
                     <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Drafts Found</h2>
                        <p className="text-gray-500">You haven't saved or submitted any properties yet.</p>
                        <Link to="/agent/add-property" className="mt-4 inline-block px-4 py-2 bg-[#F37A2A] text-white rounded-lg hover:bg-orange-500">
                            Start Adding a Property
                        </Link>
                    </div>
                ) : (
                    drafts.map((property) => (
                        <div key={property.id} className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                            
                            {/* Image Thumbnail - Fixed height on mobile, width on desktop */}
                            <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100">
                                <img
                                    src={property.images[0]?.url || "https://via.placeholder.com/224x160/E5E7EB?text=No+Image"}
                                    alt={property.details.unitName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Mobile Status Badge (Overlay on image for space saving on small screens, optional) */}
                                <div className="absolute top-2 right-2 md:hidden">
                                     {getStatusBadge(property.status)}
                                </div>
                            </div>

                            {/* Details Container */}
                            <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h2 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-1">
                                            {property.details.unitName}
                                        </h2>
                                        {/* Desktop Status Badge */}
                                        <div className="hidden md:block">
                                            {getStatusBadge(property.status)}
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {property.details.location}
                                    </p>
                                    
                                    {/* Responsive Metrics Grid: 2 columns on mobile, Flex row on desktop */}
                                    <div className="grid grid-cols-2 sm:flex sm:space-x-6 gap-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg sm:bg-transparent sm:p-0">
                                        <div className="flex items-center gap-2">
                                            <span>🏠</span> {property.details.propertyType}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📐</span> {property.details.dimensions}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>🛏️</span> {property.bedrooms > 0 ? property.bedrooms + ' Beds' : 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>🛁</span> {property.bathrooms > 0 ? property.bathrooms + ' Baths' : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Footer: Price and Buttons */}
                                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Listing Price</p>
                                        <span className="text-xl md:text-2xl font-extrabold text-[#F37A2A]">
                                            {property.details.currency} {property.details.price.toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex w-full sm:w-auto gap-3">
                                        <button
                                            onClick={() => handleEdit(property.id)}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm text-center"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-sm text-center"
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