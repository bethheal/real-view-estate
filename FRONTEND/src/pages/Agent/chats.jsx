import React, { useEffect, useState } from 'react';
import { api } from '../../config/axios';

export default function LeadDashboard() {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        const res = await api.get('/leads');
        setLeads(res.data);
    };

    const updateStatus = async (id, status) => {
        await api.patch(`/leads/${id}`, { status });
        fetchLeads(); // Refresh list
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Property Inquiries (Leads)</h1>
            
            <div className="grid gap-4">
                {leads.map(lead => (
                    <div key={lead.id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg">{lead.buyerName}</h3>
                            <p className="text-sm text-gray-500">Inquired about: <span className="text-blue-600 font-medium">{lead.property.title}</span></p>
                            <p className="text-gray-600 mt-2 italic">"{lead.message}"</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* THE MAIN ACTION: Open WhatsApp */}
                            <a 
                                href={`https://wa.me/${lead.buyerPhone.replace(/\D/g, '')}`} 
                                target="_blank"
                                className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-600 transition"
                            >
                                Chat on WhatsApp
                            </a>

                            <select 
                                value={lead.status} 
                                onChange={(e) => updateStatus(lead.id, e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm bg-gray-50"
                            >
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="QUALIFIED">Qualified</option>
                                <option value="LOST">Lost</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}