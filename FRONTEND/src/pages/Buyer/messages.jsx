import React, { useState, useEffect, useRef } from 'react';
import { User, MessageSquare, Send, Search, Bell, X, Phone, Home, MessageSquareText, Zap, ChevronLeft } from 'lucide-react';

// --- DUMMY DATA ---
const DUMMY_CONVERSATIONS = [
    {
        id: 'convo-1',
        agentName: 'Kwame Appiah',
        propertyTitle: 'Luxury Duplex - Airport View',
        phone: '233501112233',
        lastMessage: 'Agent: Sure, I can schedule a viewing tomorrow.',
        timestamp: '10m ago',
        unreadCount: 1,
        agentId: 'agent-001',
    },
    {
        id: 'convo-2',
        agentName: 'Esi Adomako',
        propertyTitle: '1-Bedroom Apartment - Cantonments',
        phone: '233245551234',
        lastMessage: 'Agent: The property is still available!',
        timestamp: '2h ago',
        unreadCount: 0,
        agentId: 'agent-002',
    },
];

const DUMMY_MESSAGES = [
    { id: 1, sender: 'buyer', text: "Hi, I am interested in the Luxury Duplex listing.", timestamp: '09:00 AM' },
    { id: 2, sender: 'agent', text: "Hello! It's still available. What questions do you have?", timestamp: '09:05 AM' },
    { id: 3, sender: 'buyer', text: "Can I schedule a viewing tomorrow?", timestamp: '09:10 AM' },
];

// --- WHATSAPP UTILITY FUNCTION ---
const getWhatsAppLink = (phoneNumber, propertyTitle) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const ghanaCode = '233'; 
    const fullNumber = cleanNumber.length === 9 ? ghanaCode + cleanNumber : cleanNumber;
    const message = `Hello, I am interested in the property: ${propertyTitle}.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${fullNumber}?text=${encodedMessage}`;
};

// --- BUYER CHAT COMPONENT ---
export default function BuyerChatInbox() {
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
            sender: 'buyer',
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        setConversations(conversations.map(convo => 
            convo.id === selectedConvo.id ? { ...convo, lastMessage: `You: ${newMsg.text}`, timestamp: 'Just now', unreadCount: 0 } : convo
        ));
    };

    const selectConversation = (convo) => {
        setSelectedConvo(convo);
        setConversations(conversations.map(c => c.id === convo.id ? { ...c, unreadCount: 0 } : c));
    };

    return (
        <div className="max-w-7xl mx-auto p-0 h-[80vh] min-h-[600px] flex rounded-xl shadow-2xl overflow-hidden border border-gray-100 bg-white">
            
            {/* Conversation Sidebar */}
            <div className={`w-full md:w-80 bg-gray-50 border-r border-gray-200 flex flex-col ${selectedConvo && 'hidden md:flex'}`}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquareText size={24} className="text-[#F37A2A]" /> 
                        My Chats
                    </h2>
                    <Bell size={20} className="text-gray-600 hover:text-[#F37A2A] cursor-pointer" />
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find an agent..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-grow overflow-y-auto">
                    {conversations.map((convo) => (
                        <div
                            key={convo.id}
                            className={`p-4 border-b border-gray-200 cursor-pointer transition duration-150 flex items-start hover:bg-gray-100 ${selectedConvo?.id === convo.id ? 'bg-white border-l-4 border-[#F37A2A] shadow-inner' : ''}`}
                            onClick={() => selectConversation(convo)}
                        >
                            <div className="relative mr-3">
                                <span 
                                    title="Chat on WhatsApp" 
                                    className="absolute -top-1 -left-1 bg-green-500 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        convo.phone && window.open(getWhatsAppLink(convo.phone, convo.propertyTitle), '_blank');
                                    }}
                                >
                                    <Phone size={12} />
                                </span>
                                <User size={40} className="text-gray-400 bg-gray-200 p-2 rounded-full" />
                                {convo.unreadCount > 0 && (
                                    <span className="absolute bottom-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                        {convo.unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">{convo.agentName}</h3>
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

            {/* Chat Window */}
            <div className={`flex-1 flex-col ${selectedConvo ? 'flex' : 'hidden md:flex'}`}>
                {selectedConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
                            <div className="flex items-center">
                                <button onClick={() => setSelectedConvo(null)} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition md:hidden" title="Back">
                                    <ChevronLeft size={20} />
                                </button>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{selectedConvo.agentName}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Home size={14} className="text-[#F37A2A]" /> {selectedConvo.propertyTitle}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition" title="Call Agent">
                                    <Phone size={20} />
                                </button>
                                {selectedConvo.phone && (
                                    <a
                                        href={getWhatsAppLink(selectedConvo.phone, selectedConvo.propertyTitle)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-full transition shadow-md flex items-center"
                                        title="WhatsApp Chat"
                                    >
                                        <Zap size={20} />
                                    </a>
                                )}
                                <button onClick={() => setSelectedConvo(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition hidden md:block" title="Close Chat">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50">
                            {loading ? (
                                <p className="text-center text-gray-500">Loading messages...</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] sm:max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${msg.sender === 'buyer' ? 'bg-[#F37A2A] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <span className={`block mt-1 text-right text-xs ${msg.sender === 'buyer' ? 'text-orange-200' : 'text-gray-400'}`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border text-gray-500 border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                            <button type="submit" className="p-3 bg-[#F37A2A] text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50" disabled={loading || !newMessage.trim()}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 hidden md:flex">
                        <MessageSquare size={80} className="mb-4" />
                        <p className="text-lg font-medium">Select a chat to start messaging an agent.</p>
                        <p className="text-sm">Your active property chats will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
