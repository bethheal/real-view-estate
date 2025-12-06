import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-4">
          <a href="/admin-dashboard">Dashboard</a>
          <a href="/admin-subscriptions">Subscriptions</a>
          <a href="/admin-agents">Agents</a>
          <a href="/admin-properties">Properties</a>
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
