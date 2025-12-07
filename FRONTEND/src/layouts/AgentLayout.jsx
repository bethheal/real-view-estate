import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../pages/Home/auth/AuthProvider";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Home, 
  FileText, 
  Users, 
  BarChart2, 
  CreditCard, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function AgentLayout() {
  const { user, logout } = useAuth();
  
  // Extract the first name for the greeting. Use 'Agent' as fallback.
  const userFirstName = user?.firstName || "Agent";
  
  // Extract the first letter for the avatar placeholder.
  const avatarLetter = userFirstName.charAt(0).toUpperCase();

  // Helper to keep the nav logic clean while applying the new style
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
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
      {/* Sidebar - Styled like the image (White, Shadow, Clean) */}
      <aside className="w-72 bg-white shadow-2xl flex flex-col fixed h-full z-20">
        
        {/* Logo Section */}
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-extrabold text-[#F37A2A] tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F37A2A] rounded-lg text-white flex items-center justify-center text-lg">K</div>
            Real View Estate
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-6 overflow-y-auto hide-scrollbar py-4">
          
          {/* Main */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Overview</p>
            <NavItem to="/agent-dashboard" icon={LayoutDashboard} label="Overview" />
          </div>

          {/* Properties Section */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Properties</p>
            <NavItem to="/agent/add-property" icon={PlusCircle} label="Add Property" />
            <NavItem to="/agent/manage-properties" icon={Home} label="Manage Listings" />
            <NavItem to="/agent/drafts" icon={FileText} label="Drafts" />
          </div>

          {/* Business Section */}
          <div className="space-y-1">
             <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business</p>
            <NavItem to="/agent/leads" icon={Users} label="Leads" />
            {/* <NavItem to="/agent/performance" icon={BarChart2} label="Performance" /> */}
            <NavItem to="/agent/subscription" icon={CreditCard} label="Subscription" />
            <NavItem to="/agent/chats" icon={MessageSquare} label="Chats" />
          </div>

           {/* Account Section */}
           <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Settings</p>
            <NavItem to="/agent/profile" icon={User} label="Profile" />
            <NavItem to="/agent/settings" icon={Settings} label="Settings" />
          </div>
        </nav>

        {/* Logout Section */}
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

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            {/* Displaying the user's first name */}
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, <span className="text-[#F37A2A]">{userFirstName}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here is an overview of your property stats today.</p>
          </div>
          
          <div className="flex gap-3">
            {/* Avatar Placeholder: Uses the first letter of the name */}
             <div className="w-10 h-10 bg-[#F37A2A] rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg border-2 border-white ring-2 ring-orange-400">
                {avatarLetter}
             </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="min-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}