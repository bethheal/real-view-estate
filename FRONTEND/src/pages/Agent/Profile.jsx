import { useState, useEffect } from "react";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
// Added 'Key' for verification code
import { User, Camera, Trash2, UploadCloud, Lock, Mail, Phone, Briefcase, Key } from "lucide-react"; 

// Assume useAuth provides the logout function which clears the session/token
import { useAuth } from "../../pages/Home/auth/AuthProvider"; 

export default function AgentProfile() {
  // Use useAuth to get the logout function for security reset
  const { logout } = useAuth(); 

  // --- State ---
  const [agent, setAgent] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    socialLinks: { facebook: "", instagram: "", twitter: "" },
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'profile', or 'password'

  // State for Change Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    verificationCode: "", // New field for the code
  });
  // Tracks the step in the password change process
  const [passwordStep, setPasswordStep] = useState('form'); // 'form' or 'verify' 

  // --- Effects ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/agent/profile");
      setAgent(res.data);
      // NOTE: You would typically set avatarPreview here if res.data.avatarUrl exists
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // --- General Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setAgent((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setAgent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleDocChange = (e) => {
    setDocuments(e.target.files[0]);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", agent.name);
    formData.append("phone", agent.phone);
    formData.append("businessName", agent.businessName || "");
    formData.append("socialLinks", JSON.stringify(agent.socialLinks));
    
    if (avatarFile) formData.append("avatar", avatarFile);
    if (documents) formData.append("documents", documents);

    try {
      await api.put("/agent/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // --- Password Change Handlers ---
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordStep1 = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    try {
      // 1. Verify current password and request a verification code
      // Backend checks currentPassword, generates a code, and sends it to agent.email
      await api.post("/agent/request-password-change-code", { currentPassword });

      toast.info(`A verification code has been sent to ${agent.email}.`);
      setPasswordStep('verify');

    } catch (err) {
      // Backend should return 401/403 for bad current password
      toast.error("Failed to verify current password. Please try again.");
    }
  };

  const handlePasswordStep2 = async (e) => {
    e.preventDefault();
    const { newPassword, verificationCode } = passwordForm;

    try {
      // 2. Submit the new password and the verification code
      // Backend validates the code and updates the password
      await api.put("/agent/confirm-password-change", { newPass: newPassword, code: verificationCode });
      
      toast.success("Password changed successfully! Logging you out for security.");
      
      // Clear local state and reset the flow
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "", verificationCode: "" });
      setPasswordStep('form'); 
      
      // 🔥 CRITICAL SECURITY STEP: Log user out to invalidate old session
      logout(); 

    } catch (err) {
      // Backend should return 400 for invalid/expired code
      toast.error("Failed to change password. The verification code may be invalid or expired.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading Profile...
      </div>
    );

  // --- COMPONENTS FOR TABS ---

  const MyDetailsTab = () => (
    <form onSubmit={handleProfileSubmit}>
        
        <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">My Details</h2>
            <p className="text-gray-500 text-sm mt-1">Update your basic contact and business information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Name */}
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={agent.name}
                onChange={handleChange}
                placeholder="Stella Coleman"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={agent.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>

            {/* Email (Read Only - Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Mail size={16} /> Email Address</label>
              <input
                type="email"
                value={agent.email}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block p-3 cursor-not-allowed outline-none"
              />
            </div>

            {/* Business Name (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Briefcase size={16} /> Business Name</label>
              <input
                type="text"
                name="businessName"
                value={agent.businessName}
                onChange={handleChange}
                placeholder="Best Choice Real Estate"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>
        </div>
        
        {/* Social Links Section */}
        <div className="mb-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    name="social.facebook"
                    value={agent.socialLinks.facebook}
                    onChange={handleChange}
                    placeholder="Facebook URL"
                    className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg p-3 outline-none focus:border-purple-500"
                />
                <input
                    type="text"
                    name="social.instagram"
                    value={agent.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg p-3 outline-none focus:border-purple-500"
                />
                <input
                    type="text"
                    name="social.twitter"
                    value={agent.socialLinks.twitter}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg p-3 outline-none focus:border-purple-500"
                />
            </div>
        </div>

        {/* Verification Documents */}
        <div className="mb-8 pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16} /> Verification Documents</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> documents</p>
                        <p className="text-xs text-gray-500">PDF, JPG or PNG</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocChange} />
                </label>
            </div>
            {documents && <p className="text-xs text-green-600 mt-2">File selected: {documents.name}</p>}
        </div>

        {/* Footer Actions for Details Tab */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
                type="button" 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
                Cancel
            </button>
            <button 
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#533CDE] text-white font-medium hover:bg-[#432ebd] shadow-md shadow-indigo-200 transition"
            >
                Save
            </button>
        </div>
    </form>
  );

  const ProfilePhotoTab = () => (
    <form onSubmit={handleProfileSubmit}>
        <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800">Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Update your profile photo here.</p>
        </div>

        {/* Photos / Avatar Section */}
        <div className="mb-8 border-b border-gray-100 pb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4">Photos</label>
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner shrink-0">
                    {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                    <User className="text-gray-400" size={32} />
                    )}
                </div>

                <div className="flex gap-3">
                    <label className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                    <Camera size={16} />
                    Change
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                    
                    {avatarPreview && (
                    <button 
                        type="button" 
                        onClick={removeAvatar}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Remove
                    </button>
                    )}
                </div>
            </div>
        </div>

        {/* Footer Actions for Profile Tab */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
                type="button" 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
                Cancel
            </button>
            <button 
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#533CDE] text-white font-medium hover:bg-[#432ebd] shadow-md shadow-indigo-200 transition"
            >
                Save
            </button>
        </div>
    </form>
  );

  const ChangePasswordTab = () => (
    <div className="space-y-8">
      
      <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            {passwordStep === 'form' 
              ? "Verify your current password and set a new one."
              : `A verification code was sent to ${agent.email}. Enter it below to confirm and finalize your password change.`
            }
          </p>
      </div>

      {/* STEP 1: Enter Passwords & Request Code */}
      {passwordStep === 'form' ? (
        <form onSubmit={handlePasswordStep1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Current Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Lock size={16} /> Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>

            {/* New Password */}
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 8 chars)"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>

            {/* Confirm New Password */}
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>
          </div>

          {/* Footer Actions for Password Step 1 */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setPasswordForm(prev => ({...prev, currentPassword: "", newPassword: "", confirmNewPassword: ""}))}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Reset Fields
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition"
            >
              Verify & Get Code
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: Enter Verification Code & Finalize */
        <form onSubmit={handlePasswordStep2}>
          <div className="grid grid-cols-1 gap-6 mb-8">
            
            {/* Verification Code */}
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Key size={16} /> Verification Code</label>
              <input
                type="text"
                name="verificationCode"
                value={passwordForm.verificationCode}
                onChange={handlePasswordChange}
                placeholder="Enter the code from your email"
                maxLength={6}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 outline-none transition"
              />
            </div>
            
            {/* Display new password read-only for confirmation */}
            <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password (Verification Pending)</label>
                <input
                    type="password"
                    // Use a placeholder that reflects the actual new password is ready
                    value={passwordForm.newPassword ? "••••••••" : ""} 
                    readOnly
                    className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block p-3 cursor-not-allowed outline-none"
                />
            </div>
          </div>

          {/* Footer Actions for Password Step 2 */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setPasswordStep('form')}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-md shadow-red-200 transition"
            >
              Change Password & Log Out
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // --- Main Render ---
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-4 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === 'details' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            My details
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === 'profile' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab("password")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === 'password' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Password
          </button>
        </div>
      </div>

      {/* Content based on Active Tab */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {activeTab === "details" && <MyDetailsTab />}
        {activeTab === "profile" && <ProfilePhotoTab />}
        {activeTab === "password" && <ChangePasswordTab />}
      </div>
    </div>
  );
}