import React, { useState, useEffect, useRef } from 'react';
import { User, MessageSquare, Send, Search, Bell, X, Phone, Home, MessageSquareText, Zap } from 'lucide-react';
// Note: Tailwind doesn't have a WhatsApp icon by default, so we'll use a placeholder or style a standard icon.
// For this example, we'll use a simple button style to represent WhatsApp.

// --- DUMMY DATA (No change needed, but included for completeness) ---
const DUMMY_CONVERSATIONS = [
    {
        id: 'convo-1',
        leadName: 'Akua Mensah',
        propertyTitle: 'Luxury Duplex - Airport View',
        phone: '245551234', // Assuming Ghana format (e.g., 24 555 1234)
        lastMessage: 'I would like to view the property tomorrow.',
        timestamp: '2m ago',
        unreadCount: 2,
        leadId: 'lead-001',
    },
    {
        id: 'convo-2',
        leadName: 'Kofi Boateng',
        propertyTitle: '1-Bedroom Apartment - Cantonments',
        phone: '501112222', 
        lastMessage: 'Agent: Sure, I can send you the floor plan.',
        timestamp: '1h ago',
        unreadCount: 0,
        leadId: 'lead-002',
    },
    {
        id: 'convo-3',
        leadName: 'Ama Owusu',
        propertyTitle: 'Beachfront Villa - Ada',
        phone: '209990000',
        lastMessage: 'Hello, is this still available?',
        timestamp: '1d ago',
        unreadCount: 1,
        leadId: 'lead-003',
    },
];

const DUMMY_MESSAGES = [
    { id: 1, sender: 'lead', text: "Hello, I found the listing for the Luxury Duplex on your website.", timestamp: '09:30 AM' },
    { id: 2, sender: 'agent', text: "Good morning, Akua! Yes, it's available. What questions can I answer for you?", timestamp: '09:35 AM' },
    { id: 3, sender: 'lead', text: "It looks beautiful! I would like to view the property tomorrow.", timestamp: '09:40 AM' },
    { id: 4, sender: 'agent', text: "Great. I can schedule that for 3 PM. Does that work for you?", timestamp: '09:42 AM' },
    { id: 5, sender: 'lead', text: "3 PM is perfect. Thank you!", timestamp: '09:45 AM' },
];
// --- END DUMMY DATA ---


// --- WHATSAPP UTILITY FUNCTION ---
const getWhatsAppLink = (phoneNumber, propertyTitle) => {
    // Assuming numbers are provided without the international code (+233) but will be prepended here.
    // Replace non-numeric characters.
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const ghanaCode = '233'; 

    // Prepend '233' if it's a 9-digit number (common Ghanaian format without leading 0)
    // Adjust this logic based on how your phone numbers are stored.
    const fullNumber = cleanNumber.length === 9 ? ghanaCode + cleanNumber : cleanNumber;

    const message = `Hello, I am the agent for the property: ${propertyTitle}. I'm following up on your inquiry.`;
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${fullNumber}?text=${encodedMessage}`;
};
// --- END UTILITY ---


export default function AgentChatInbox() {
    const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);
    const [selectedConvo, setSelectedConvo] = useState(DUMMY_CONVERSATIONS[0]);
    const [messages, setMessages] = useState(DUMMY_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedConvo) {
            setLoading(true);
            setTimeout(() => {
                 setMessages(DUMMY_MESSAGES);
                 setLoading(false);
            }, 300);
        }
    }, [selectedConvo]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: messages.length + 1,
            sender: 'agent',
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        setConversations(conversations.map(convo => 
            convo.id === selectedConvo.id ? { ...convo, lastMessage: `Agent: ${newMsg.text}`, timestamp: 'Just now', unreadCount: 0 } : convo
        ));
    };


    const selectConversation = (convo) => {
        setSelectedConvo(convo);
        setConversations(conversations.map(c => 
            c.id === convo.id ? { ...c, unreadCount: 0 } : c
        ));
    };

    return (
        <div className="max-w-7xl mx-auto p-0 h-[80vh] min-h-[600px] flex rounded-xl shadow-2xl overflow-hidden border border-gray-100 bg-white">
            
            {/* 1. Conversation Sidebar (Left Pane) */}
            <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquareText size={24} className="text-[#F37A2A]" /> 
                        Agent Inbox
                    </h2>
                    <Bell size={20} className="text-gray-600 hover:text-[#F37A2A] cursor-pointer" />
                </div>
                
                {/* Search Bar Placeholder */}
                <div className="p-4">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find a lead..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-grow overflow-y-auto">
                    {conversations.map((convo) => (
                        <div
                            key={convo.id}
                            className={`p-4 border-b border-gray-200 cursor-pointer transition duration-150 flex items-start hover:bg-gray-100 ${
                                selectedConvo?.id === convo.id ? 'bg-white border-l-4 border-[#F37A2A] shadow-inner' : ''
                            }`}
                        >
                            <div 
                                onClick={(e) => { 
                                    e.stopPropagation(); // Prevents selecting the convo when clicking the link
                                    convo.phone && window.open(getWhatsAppLink(convo.phone, convo.propertyTitle), '_blank');
                                }}
                                className="relative mr-3"
                            >
                                {/* WhatsApp/Contact Icon */}
                                <span title="Chat on WhatsApp" className="absolute -top-1 -left-1 bg-green-500 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition">
                                    <Phone size={12} /> {/* Using Phone as a stand-in for WhatsApp icon */}
                                </span>
                                
                                <User size={40} className="text-gray-400 bg-gray-200 p-2 rounded-full" />
                                {convo.unreadCount > 0 && (
                                    <span className="absolute bottom-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                        {convo.unreadCount}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0" onClick={() => selectConversation(convo)}>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">{convo.leadName}</h3>
                                    <span className="text-xs text-gray-400">{convo.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                    <Home size={12} /> {convo.propertyTitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Chat Window (Right Pane) */}
            <div className="flex-1 flex flex-col">
                {selectedConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{selectedConvo.leadName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Home size={14} className="text-[#F37A2A]" /> {selectedConvo.propertyTitle}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                
                                {/* 📞 Direct Call Button (Existing) */}
                                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition" title="Call Lead">
                                    <Phone size={20} />
                                </button>
                                
                                {/* 🟢 WhatsApp Button (NEW) */}
                                {selectedConvo.phone && (
                                    <a
                                        href={getWhatsAppLink(selectedConvo.phone, selectedConvo.propertyTitle)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-full transition shadow-md flex items-center"
                                        title="Start WhatsApp Chat"
                                    >
                                        <Zap size={20} /> {/* Using Zap as a stand-in for a stylish icon */}
                                    </a>
                                )}
                                
                                {/* Close Chat */}
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition" title="Close Chat">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Message Area (No changes here) */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                            {loading ? (
                                <p className="text-center text-gray-500">Loading messages...</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                                            msg.sender === 'agent' 
                                                ? 'bg-[#F37A2A] text-white rounded-br-none' 
                                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                                        }`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <span className={`block mt-1 text-right text-xs ${msg.sender === 'agent' ? 'text-orange-200' : 'text-gray-400'}`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                             <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area (No changes here) */}
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-1 px-4 py-2 border text-gray-500 border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="p-3 bg-[#F37A2A] text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50"
                                disabled={loading || !newMessage.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageSquare size={80} className="mb-4" />
                        <p className="text-lg font-medium">Select a conversation to start chatting.</p>
                        <p className="text-sm">New leads will appear in the left sidebar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}