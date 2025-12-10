import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from "../../config/axios";
import { toast } from "react-toastify";

// --- DUMMY DATA (Simulates leads fetched from the backend for a property) ---
const DUMMY_LEADS_DATA = [
    {
        _id: "lead-a1",
        name: "Akua Mensah",
        email: "akua.m@example.com",
        phone: "+233 24 555 1234",
        message: "I am very interested in this property and would like to schedule a viewing early next week.",
        status: "New", // New, Contacted, Qualified, Lost
        inquiryDate: "2025-12-05T10:00:00Z",
    },
    {
        _id: "lead-a2",
        name: "Kofi Boateng",
        email: "kofi.b@test.com",
        phone: "+233 50 111 2222",
        message: "Can you confirm the total monthly rent/mortgage payment, please?",
        status: "Contacted",
        inquiryDate: "2025-12-04T15:30:00Z",
    },
    {
        _id: "lead-a3",
        name: "Ama Owusu",
        email: "ama.o@web.net",
        phone: null,
        message: "I need to know the proximity to international schools. Serious buyer.",
        status: "New",
        inquiryDate: "2025-12-04T09:15:00Z",
    },
];
// --- END DUMMY DATA ---

// --- Helper Function ---
const getStatusBadgeColor = (status) => {
    switch (status) {
        case "New":
            return "bg-blue-100 text-blue-800";
        case "Contacted":
            return "bg-yellow-100 text-yellow-800";
        case "Qualified":
            return "bg-green-100 text-green-800";
        case "Lost":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function PropertyLeadsDetail() {
    // Get the propertyId from the URL (e.g., from /agent/leads/prop-live-1)
    const { propertyId } = useParams();
    
    const [leads, setLeads] = useState([]);
    const [propertyTitle, setPropertyTitle] = useState("Loading Property...");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch the leads for the specific property
    const fetchPropertyLeads = async () => {
        try {
            // 1. Simulate fetching the property details to get the title
            // In a real app: const propertyRes = await api.get(`/property/${propertyId}`);
            // setPropertyTitle(propertyRes.data.title);
            
            // DUMMY: Set a placeholder title
            setPropertyTitle(`Property ID: ${propertyId.substring(0, 10)}...`);

            // 2. Fetch the leads
            // In a real app: const leadsRes = await api.get(`/agent/leads/${propertyId}`);
            // setLeads(leadsRes.data);
            
            // DUMMY: Use dummy data
            setTimeout(() => {
                setLeads(DUMMY_LEADS_DATA);
                setLoading(false);
            }, 500);

        } catch (err) {
            toast.error("Failed to load leads or property details.");
            setError("Could not retrieve leads from the server.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropertyLeads();
    }, [propertyId]); // Re-run if the propertyId changes

    // --- Action Handlers ---

    // Function to update lead status (e.g., from New to Contacted)
    const updateLeadStatus = async (leadId, newStatus) => {
        // In a real app: await api.patch(`/agent/lead/${leadId}`, { status: newStatus });
        
        // DUMMY update:
        setLeads(prevLeads => prevLeads.map(lead => 
            lead._id === leadId ? { ...lead, status: newStatus } : lead
        ));
        toast.success(`Lead ${leadId} status updated to ${newStatus}`);
    };

    if (loading) {
        return <p className="text-center p-12 text-gray-600">Loading leads for property...</p>;
    }
    
    if (error) {
        return <p className="text-center p-12 text-red-600 bg-red-50 border border-red-300 rounded-lg">{error}</p>;
    }
    
    // --- Render Component ---

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-8 border-b pb-4">
                {/* Link back to the main property management page */}
                <Link to="/agent/my-properties" className="text-sm text-blue-600 hover:underline mb-2 block">
                    &larr; Back to Manage Listings
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">
                    📞 Leads for: <span className="text-[#F37A2A]">{propertyTitle}</span>
                </h1>
                <p className="text-gray-500 mt-1">Total Inquiries: **{leads.length}**</p>
            </header>
            
            {leads.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Inquiries Yet</h2>
                    <p className="text-gray-500">No leads have been recorded for this property.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {leads.map((lead) => (
                        <div key={lead._id} className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4 border-b pb-3">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{lead.name}</h2>
                                    <p className="text-sm text-gray-500">Inquired on: {new Date(lead.inquiryDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                <p className="text-gray-700">
                                    **Email:** <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                                </p>
                                <p className="text-gray-700">
                                    **Phone:** {lead.phone ? <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a> : 'N/A'}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 border rounded-lg mb-4">
                                <p className="font-semibold text-gray-700 mb-2">Inquiry Message:</p>
                                <p className="text-gray-600 italic">"{lead.message}"</p>
                            </div>

                            {/* Action Buttons: Status Updates - Enhanced Responsiveness */}
                            <div className="flex flex-wrap gap-3 pt-3 border-t">
                                <button
                                    onClick={() => updateLeadStatus(lead._id, 'Contacted')}
                                    disabled={lead.status === 'Contacted' || lead.status === 'Qualified'}
                                    className="flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 transition"
                                >
                                    Mark as Contacted
                                </button>
                                <button
                                    onClick={() => updateLeadStatus(lead._id, 'Qualified')}
                                    disabled={lead.status === 'Qualified'}
                                    className="flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                                >
                                    Mark as Qualified
                                </button>
                                <button
                                    onClick={() => updateLeadStatus(lead._id, 'Lost')}
                                    className="flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                                >
                                    Mark as Lost
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}