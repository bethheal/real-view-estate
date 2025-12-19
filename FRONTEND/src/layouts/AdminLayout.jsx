import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Home, CreditCard, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path ? "bg-orange-50 text-[#ed7d31]" : "text-gray-700";

  const handleLogout = () => {
    // Clear your auth tokens/session here
    localStorage.removeItem("adminToken"); 
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white h-screen shadow-md flex flex-col fixed left-0 top-0 z-10">
        <div className="p-6 font-bold text-2xl text-[#ed7d31] border-b">
          Admin
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className={`flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors ${isActive("/admin/dashboard")}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <Link to="/admin/agents" className={`flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors ${isActive("/admin/agents")}`}>
            <Users size={20} /> Agents
          </Link>
          
          <Link to="/admin/properties" className={`flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors ${isActive("/admin/properties")}`}>
            <Home size={20} /> Property Review
          </Link>
          
          <Link to="/admin/subscriptions" className={`flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors ${isActive("/admin/subscriptions")}`}>
            <CreditCard size={20} /> Subscriptions
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 text-red-500 border-t hover:bg-red-50 transition-colors mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}