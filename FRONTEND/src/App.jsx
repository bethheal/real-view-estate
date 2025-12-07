// App.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Layouts
import RootLayout from "./globalComponents/RootLayout";
import AuthLayout from "./globalComponents/AuthLayout";
import AppSettings from "./globalComponents/settings";
import BuyerLayout from "./layouts/BuyerLayout";
import AgentLayout from "./layouts/AgentLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home/Home";
import Contact from "./pages/Home/Contact";
import Services from "./pages/Home/Services";
import Properties from "./pages/Home/Properties";
import FAQ from "./pages/Home/FAQ";

// Buyer Pages
import BuyerDashboard from "./pages/Buyer/Dashboard";

// Agent Pages
import AgentDashboard from "./pages/Agent/Dashboard";
import AddProperty from "./pages/Agent/AddProperty";
import ManageProperties from "./pages/Agent/ManageProperties";
import AgentProfile from "./pages/Agent/Profile";
import AgentsDraft from "./pages/Agent/AgentsDraft";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAgents from "./pages/admin/Agents";
import PropertyReview from "./pages/admin/PropertyReview";

// Lazy Loaded Auth
const Login = React.lazy(() => import("./pages/Home/auth/Login"));
const SignUp = React.lazy(() => import("./pages/Home/auth/SignUp"));

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Subscriptions from "./pages/admin/subscriptions";
import PropertyLeadsDetail from "./pages/Agent/PropertyLeadsDetail";
import SubscriptionPlans from "./pages/Agent/subscription";
import AgentChatInbox from "./pages/Agent/chats";

function App() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="properties" element={<Properties />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help-center" element={<FAQ />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        {/* BUYER DASHBOARD */}
        <Route element={<BuyerLayout />}>
          <Route path="buyer-dashboard" element={<BuyerDashboard />} />
        </Route>

        {/* AGENT DASHBOARD */}
        <Route element={<AgentLayout />}>
          <Route path="agent-dashboard" element={<AgentDashboard />} />
          <Route path="agent/add-property" element={<AddProperty />} />
          <Route
            path="agent/manage-properties"
            element={<ManageProperties />}
          />
          <Route path="agent/profile" element={<AgentProfile />} />
          <Route path="agent/drafts" element={<AgentsDraft />} />
          <Route path="agent/subscription" element={<SubscriptionPlans />} />
                    <Route path="agent/chats" element={<AgentChatInbox />} />


          <Route
            path="/agent/leads"
            element={<PropertyLeadsDetail />}
          />
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route element={<AdminLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-subscriptions" element={<Subscriptions />} />
          <Route path="admin-agents" element={<AdminAgents />} />
          <Route path="admin-property-review" element={<PropertyReview />} />
        </Route>
      </Routes>

      {/* TOAST NOTIFICATIONS */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </Suspense>
  );
}

export default App;
