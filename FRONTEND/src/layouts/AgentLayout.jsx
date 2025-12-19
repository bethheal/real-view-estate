import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../pages/Home/auth/AuthProvider";
import axios from "axios";
import { 
  LayoutDashboard, PlusCircle, Home, FileText, Users, CreditCard,
  MessageSquare, User, Settings, LogOut, Menu, X
} from "lucide-react";

export default function AgentLayout() {
  const { logout } = useAuth(); // logout from auth context
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get("/agent/me"); // no need to manually add token
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch agent profile:", err);
    }
  };
  fetchProfile();
}, []);

  const userFirstName = user?.name?.split(" ")[0] || "Agent";
  const avatarLetter = user?.avatarUrl ? null : userFirstName.charAt(0).toUpperCase();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={closeSidebar}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
          isActive
            ? "bg-[#F37A2A] text-white shadow-md shadow-orange-200"
            : "text-gray-500 hover:bg-orange-50 hover:text-[#F37A2A]"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-[#FAEEDC]">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:h-screen lg:shadow-none lg:border-r lg:border-gray-100`}>
        
        {/* Logo */}
        <div className="p-6 md:p-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F37A2A] tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F37A2A] rounded-lg text-white flex items-center justify-center text-lg">K</div>
            Real View
          </h2>
          <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-6 overflow-y-auto hide-scrollbar py-4">
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Overview</p>
            <NavItem to="/agent-dashboard" icon={LayoutDashboard} label="Overview" />
          </div>
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Properties</p>
            <NavItem to="/agent/add-property" icon={PlusCircle} label="Add Property" />
            <NavItem to="/agent/manage-properties" icon={Home} label="Manage Listings" />
            <NavItem to="/agent/drafts" icon={FileText} label="Drafts" />
          </div>
          <div className="space-y-1">
             <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business</p>
            <NavItem to="/agent/leads" icon={Users} label="Leads" />
            <NavItem to="/agent/subscription" icon={CreditCard} label="Subscription" />
            <NavItem to="/agent/chats" icon={MessageSquare} label="Chats" />
          </div>
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Settings</p>
            <NavItem to="/agent/profile" icon={User} label="Profile" />
            <NavItem to="/agent/settings" icon={Settings} label="Settings" />
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-72 flex flex-col min-h-screen overflow-auto">
        <header className="sticky top-0 z-20 bg-[#FAEEDC]/95 backdrop-blur-sm px-4 md:px-8 py-4 md:py-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Welcome, <span className="text-[#F37A2A]">{userFirstName}</span>
              </h1>
              <p className="hidden md:block text-gray-500 text-sm mt-1">Here is an overview of your property stats today.</p>
            </div>
          </div>
          <div className="flex gap-3">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full shadow-md border-2 border-white ring-2 ring-orange-400 object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-[#F37A2A] rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg border-2 border-white ring-2 ring-orange-400">
                {avatarLetter}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 px-4 md:px-8 pb-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
