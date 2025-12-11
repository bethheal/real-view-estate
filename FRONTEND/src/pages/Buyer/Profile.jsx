import { useState, useEffect } from "react";
import { api } from "../../config/axios"; // Assuming this is your configured axios instance
import { toast } from "react-toastify";
import {
  User,
  Camera,
  Trash2,
  Lock,
  Mail,
  Phone,
  Key,
  Home, // New icon for 'My Interests' or 'My Properties'
} from "lucide-react";
import { useAuth } from "../../pages/Home/auth/AuthProvider"; // Assuming this handles user/logout

// -------------------- Tab Components -------------------- //

function MyDetailsTab({ buyer, handleChange, handleProfileSubmit }) {
  return (
    <form onSubmit={handleProfileSubmit}>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">My Details</h2>
        <p className="text-gray-500 text-sm mt-1">
          Update your basic contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={buyer.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={buyer.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Mail size={16} /> Email Address
          </label>
          <input
            type="email"
            value={buyer.email}
            readOnly
            className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block p-3 cursor-not-allowed outline-none"
          />
        </div>
      </div>

      {/* Footer */}
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
          className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
        >
          Save Details
        </button>
      </div>
    </form>
  );
}

function ProfilePhotoTab({
  avatarPreview,
  handleAvatarChange,
  removeAvatar,
  handleProfileSubmit,
}) {
  return (
    <form onSubmit={handleProfileSubmit}>
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800">Profile Photo</h2>
        <p className="text-gray-500 text-sm mt-1">
          Update your profile photo here.
        </p>
      </div>

      <div className="mb-8 border-b border-gray-100 pb-8">
        <label className="block text-sm font-bold text-gray-700 mb-4">
          Photos
        </label>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              // Default avatar icon
              <User className="text-gray-400" size={32} />
            )}
          </div>

          <div className="flex gap-3">
            <label className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
              <Camera size={16} />
              Change
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
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
          className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
        >
          Save Photo
        </button>
      </div>
    </form>
  );
}

function ChangePasswordTab({
  passwordStep,
  passwordForm,
  handlePasswordChange,
  handlePasswordStep1,
  handlePasswordStep2,
  setPasswordStep,
  buyerEmail,
}) {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
        <p className="text-gray-500 text-sm mt-1">
          {passwordStep === "form"
            ? "Verify your current password and set a new one."
            : `A verification code was sent to ${buyerEmail}. Enter it below to confirm and finalize your password change.`}
        </p>
      </div>

      {passwordStep === "form" ? (
        <form onSubmit={handlePasswordStep1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} /> Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 8 chars)"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }))
              }
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Reset Fields
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
            >
              Verify & Get Code
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordStep2}>
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="md:col-span-1">
              <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Key size={16} /> Verification Code
              </label>
              <input
                type="text"
                name="verificationCode"
                value={passwordForm.verificationCode}
                onChange={handlePasswordChange}
                placeholder="Enter the code from your email"
                maxLength={6}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                New Password (Verification Pending)
              </label>
              <input
                type="password"
                value={passwordForm.newPassword ? "••••••••" : ""}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block p-3 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setPasswordStep("form")}
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
}

function BuyerInterestsTab() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">My Interests</h2>
      <p className="text-gray-500 text-sm mb-6">
        This is where you can manage your saved searches, favorite properties, and set up alert preferences.
      </p>
      
      {/* Placeholder content for Buyer specific functionality */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
        <Home className="w-10 h-10 mx-auto mb-4 text-indigo-400" />
        <p className="font-semibold mb-2">Manage Your Dream Home Preferences</p>
        <p className="text-sm">
          Saved searches, property alerts, and favorited listings would appear here.
          <br /> (Functionality to be implemented in a dedicated component.)
        </p>
      </div>
    </div>
  );
}


// -------------------- Main Component -------------------- //

export default function BuyerProfile() {
  const { logout, user } = useAuth();
  
  // 1. Simplified State for a Buyer
  const [buyer, setBuyer] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    // Removed: businessName, socialLinks
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // Default tab

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    verificationCode: "",
  });
  const [passwordStep, setPasswordStep] = useState("form");

  // 2. Fetch Profile Hook
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // NOTE: Update this API endpoint to your buyer profile endpoint
      const res = await api.get("/buyer/profile"); 
      setBuyer({
        name: res.data.name || "",
        email: res.data.email || user?.email || "",
        phone: res.data.phone || "",
      });
      // Optionally set an existing avatar URL for preview if your API returns it
      if (res.data.avatarUrl) {
          setAvatarPreview(res.data.avatarUrl);
      }
    } catch {
      toast.error("Failed to load buyer profile");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyer((prev) => ({ ...prev, [name]: value }));
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Only handles 'details' and 'profile' tab submissions
    if (activeTab === "details") {
      const { name, phone } = buyer;
      try {
        // NOTE: Update API endpoint and payload
        await api.put("/buyer/profile-details", { name, phone }); 
        toast.success("Details updated successfully");
      } catch {
        toast.error("Failed to update details");
      }
    } else if (activeTab === "profile") {
        if (!avatarFile) {
            return toast.error("Please select a new profile photo or remove the existing one to clear it.");
        }
        
        const formData = new FormData();
        formData.append("avatar", avatarFile); // Avatar file only
        
        try {
            // NOTE: Update API endpoint for avatar upload
            await api.put("/buyer/profile-avatar", formData, { 
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Profile photo updated successfully");
            // Re-fetch profile to ensure avatarUrl is updated or handle success state
        } catch {
            toast.error("Failed to update profile photo");
        }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordStep1 = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    if (newPassword !== confirmNewPassword)
      return toast.error("New passwords do not match.");
    if (newPassword.length < 8)
      return toast.error("New password must be at least 8 characters long.");

    try {
      // NOTE: Update API endpoint for buyer
      await api.post("/buyer/request-password-change-code", { 
        currentPassword,
      });
      toast.info(`A verification code has been sent to ${buyer.email}.`);
      setPasswordStep("verify");
    } catch {
      toast.error("Failed to verify current password. Please try again.");
    }
  };

  const handlePasswordStep2 = async (e) => {
    e.preventDefault();
    const { newPassword, verificationCode } = passwordForm;

    try {
      // NOTE: Update API endpoint for buyer
      await api.put("/buyer/confirm-password-change", { 
        newPass: newPassword,
        code: verificationCode,
      });
      toast.success(
        "Password changed successfully! Logging you out for security."
      );
      // Clear form and step
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        verificationCode: "",
      });
      setPasswordStep("form");
      logout(); // Important: log the user out after a password change
    } catch {
      toast.error(
        "Failed to change password. The verification code may be invalid or expired."
      );
    }
  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading Buyer Profile...
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Buyer Account Settings</h1>
        <div className="flex gap-6 mt-4 border-b border-gray-200">
          {/* My Details Tab */}
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "details"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            My Details
          </button>
          {/* Profile Photo Tab */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "profile"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Profile Photo
          </button>
          {/* Password Tab */}
          <button
            onClick={() => setActiveTab("password")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "password"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Password
          </button>
          {/* Buyer-Specific Tab: Interests/Properties */}
          <button
            onClick={() => setActiveTab("interests")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "interests"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            My Interests
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {activeTab === "details" && (
          <MyDetailsTab
            buyer={buyer}
            handleChange={handleChange}
            handleProfileSubmit={handleProfileSubmit}
          />
        )}
        {activeTab === "profile" && (
          <ProfilePhotoTab
            avatarPreview={avatarPreview}
            handleAvatarChange={handleAvatarChange}
            removeAvatar={removeAvatar}
            handleProfileSubmit={handleProfileSubmit}
          />
        )}
        {activeTab === "password" && (
          <ChangePasswordTab
            passwordStep={passwordStep}
            passwordForm={passwordForm}
            handlePasswordChange={handlePasswordChange}
            handlePasswordStep1={handlePasswordStep1}
            handlePasswordStep2={handlePasswordStep2}
            setPasswordStep={setPasswordStep}
            buyerEmail={buyer.email}
          />
        )}
        {activeTab === "interests" && (
          <BuyerInterestsTab />
        )}
      </div>
    </div>
  );
}