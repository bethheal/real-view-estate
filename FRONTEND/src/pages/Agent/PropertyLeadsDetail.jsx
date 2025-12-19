import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import { MessageCircle, Phone, Mail, ArrowLeft } from 'lucide-react'; // Optional icons

const getStatusBadgeColor = (status) => {
    switch (status) {
        case "NEW": return "bg-blue-100 text-blue-800";
        case "CONTACTED": return "bg-yellow-100 text-yellow-800";
        case "QUALIFIED": return "bg-green-100 text-green-800";
        case "LOST": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

export default function PropertyLeadsDetail() {
    const { propertyId } = useParams();
    const [leads, setLeads] = useState([]);
    const [propertyTitle, setPropertyTitle] = useState("Loading...");
    const [loading, setLoading] = useState(true);

    const fetchPropertyLeads = async () => {
        try {
            // Real API call to your Prisma backend
            const res = await api.get(`/agent/properties/${propertyId}/leads`);
            setLeads(res.data.leads);
            setPropertyTitle(res.data.title);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load leads.");
            setLoading(false);
        }
    };

    useEffect(() => { fetchPropertyLeads(); }, [propertyId]);

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await api.patch(`/leads/${leadId}/status`, { status: newStatus });
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            toast.success("Status updated");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    // Helper to open WhatsApp
    const openWhatsApp = (phone, name, property) => {
        const cleanPhone = phone.replace(/\D/g, ''); // Removes spaces and +
        const message = `Hello ${name}, I am the agent for ${property}. I saw your inquiry!`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <div className="p-20 text-center">Loading leads...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="mb-8">
                <Link to="/agent/dashboard" className="flex items-center text-blue-600 gap-2 mb-4 hover:underline">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Leads: <span className="text-[#F37A2A]">{propertyTitle}</span></h1>
            </header>

            <div className="space-y-4">
                {leads.map((lead) => (
                    <div key={lead.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{lead.buyerName}</h2>
                                <p className="text-sm text-gray-500 italic mb-3">"{lead.message}"</p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1"><Mail size={14}/> {lead.email}</span>
                                    <span className="flex items-center gap-1"><Phone size={14}/> {lead.buyerPhone}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(lead.status)}`}>
                                {lead.status}
                            </span>
                        </div>

                        <div className="mt-6 pt-4 border-t flex flex-wrap gap-3">
                            {/* THE WHATSAPP ACTION */}
                            <button 
                                onClick={() => openWhatsApp(lead.buyerPhone, lead.buyerName, propertyTitle)}
                                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition"
                            >
                                <MessageCircle size={18} /> Chat on WhatsApp
                            </button>

                            <div className="flex gap-2 ml-auto">
                                <button onClick={() => updateLeadStatus(lead.id, 'QUALIFIED')} className="px-3 py-2 text-xs border rounded-lg hover:bg-green-50">Mark Qualified</button>
                                <button onClick={() => updateLeadStatus(lead.id, 'LOST')} className="px-3 py-2 text-xs border rounded-lg hover:bg-red-50 text-red-600">Mark Lost</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}