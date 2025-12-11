import { toast } from "react-toastify";
import { Bell, Globe, DollarSign, Clock, VolumeX, Mail, Moon, Sun, Ruler, Trash2, Download } from "lucide-react"; 

// Assume the hook is correctly located here
import { useTheme } from "../hooks/useTheme"; 
import { useGlobalSettings } from "./useGlobalSettings";

// import { useGlobalSettings } from "../hooks/useGlobalSettings"; // Adjust path as necessary

export default function AppSettings() {
  // 1. Connect to Global State and Handlers
  const { settings, loading, updateLocalSettings, saveSettings } = useGlobalSettings();
  const { theme, toggleTheme } = useTheme();

  // --- Data & Options (These can remain local as they are constants) ---
  const timezoneOptions = [
    { value: "GMT-5", label: "Eastern Time (GMT-5)" },
    { value: "GMT-8", label: "Pacific Time (GMT-8)" },
    { value: "GMT", label: "Greenwich Mean Time (GMT)" },
    { value: "GMT+5", label: "Indian Standard Time (GMT+5:30)" },
  ];

  // --- Refactored Handlers ---
  
  // 2. Simplifies handling for standard inputs (select, text)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateLocalSettings(name, value); // Calls global state update
  };

  // 3. Simplifies handling for checkboxes
  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    updateLocalSettings(name, checked); // Calls global state update
  };

  // 4. Simplifies submission to use the centralized API save function
  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(settings); // Calls global API save
  };
  
  // Handlers for specific actions (remain local as they don't affect global settings state)
  const handleDataExport = () => {
    toast.info("Data export initiated. You will receive an email shortly.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      toast.error("Account deletion process started.");
    }
  };


  // Loading state comes from the global hook
  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading Settings...
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">System Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* --- SECTION 1: Display & Interface Preferences --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3"><Sun size={20} className="text-purple-600" /> Interface & Theme</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Dark/Light Mode Toggle (No changes needed, uses local useTheme hook) */}
            <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    Theme Preference
                </label>
                <div 
                    onClick={toggleTheme} 
                    className="relative flex items-center w-full max-w-xs p-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                >
                    <div 
                        className={`absolute w-1/2 h-8 rounded-md shadow-md transition-transform duration-300 ease-in-out ${
                            theme === 'dark' ? 'translate-x-full bg-purple-600' : 'translate-x-0 bg-white border border-gray-300'
                        }`}
                    />
                    <div className="relative w-1/2 text-center py-1 font-medium text-sm z-10">
                        <span className={`transition-colors ${theme === 'light' ? 'text-gray-800' : 'text-gray-500 dark:text-white'}`}>
                            <Sun size={16} className="inline mr-2" /> Light
                        </span>
                    </div>
                    <div className="relative w-1/2 text-center py-1 font-medium text-sm z-10">
                         <span className={`transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-500 dark:text-gray-300'}`}>
                             <Moon size={16} className="inline mr-2" /> Dark
                         </span>
                    </div>
                </div>
            </div>
            
            {/* Language (Uses global state and handler) */}
            <div className="col-span-1">
              <label htmlFor="language" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Globe size={16} /> Language</label>
              <select
                id="language"
                name="language"
                value={settings.language} // Reads from global state
                onChange={handleInputChange} // Calls global update
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-lg block p-3 outline-none"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: Regional & Data Preferences (Uses global state and handler) --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3"><Globe size={20} className="text-purple-600" /> Regional Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Currency */}
            <div className="col-span-1">
              <label htmlFor="currency" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><DollarSign size={16} /> Currency</label>
              <select
                id="currency"
                name="currency"
                value={settings.currency} // Reads from global state
                onChange={handleInputChange} // Calls global update
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-lg block p-3 outline-none"
              >
                                 <option value="GHS">(GHS)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="col-span-1">
              <label htmlFor="timezone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Clock size={16} /> Timezone</label>
              <select
                id="timezone"
                name="timezone"
                value={settings.timezone} // Reads from global state
                onChange={handleInputChange} // Calls global update
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-lg block p-3 outline-none"
              >
                {timezoneOptions.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
              </select>
            </div>

            {/* Unit of Measurement */}
            <div className="col-span-1">
              <label htmlFor="units" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Ruler size={16} /> Measurement Units</label>
              <select
                id="units"
                name="units"
                value={settings.units} // Reads from global state
                onChange={handleInputChange} // Calls global update
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-lg block p-3 outline-none"
              >
                <option value="Imperial">Imperial (sq. ft.)</option>
                <option value="Metric">Metric (sq. m)</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: Notification Preferences (Uses global state and handler) --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3"><Bell size={20} className="text-purple-600" /> Notification Preferences</h2>
          <p className="text-gray-500 text-sm mb-6">Control how and when you receive alerts about new activity.</p>
          
          <div className="space-y-4">
            
            {/* Toggle: Email Notifications */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500" />
                <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">Email Alerts</label>
                <p className="text-xs text-gray-400">Receive alerts for important changes (e.g., new lead, price drop).</p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                id="emailNotifications"
                checked={settings.emailNotifications} // Reads from global state
                onChange={handleToggleChange} // Calls global update
                className="relative w-10 h-6 transition-colors bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-600 checked:bg-purple-600"
              />
            </div>

            {/* Toggle: In-App Notifications */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" />
                <label htmlFor="inAppNotifications" className="font-medium text-gray-700 dark:text-gray-300">In-App Notifications</label>
                <p className="text-xs text-gray-400">Show notifications directly within the dashboard.</p>
              </div>
              <input
                type="checkbox"
                name="inAppNotifications"
                id="inAppNotifications"
                checked={settings.inAppNotifications} // Reads from global state
                onChange={handleToggleChange} // Calls global update
                className="relative w-10 h-6 transition-colors bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-600 checked:bg-purple-600"
              />
            </div>

            {/* Toggle: Do Not Disturb */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center gap-3">
                <VolumeX size={18} className="text-red-500" />
                <label htmlFor="dnd" className="font-medium text-gray-700 dark:text-gray-300">Do Not Disturb Mode</label>
                <p className="text-xs text-gray-400">Temporarily pause non-critical alerts.</p>
              </div>
              <input
                type="checkbox"
                name="dnd"
                id="dnd"
                checked={settings.dnd} // Reads from global state
                onChange={handleToggleChange} // Calls global update
                className="relative w-10 h-6 transition-colors bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-600 checked:bg-red-500"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 4: Data Management (Remains local) --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3"><Download size={20} className="text-purple-600" /> Account & Data</h2>
          <p className="text-gray-500 text-sm mb-6">Manage your data and account life cycle.</p>
          
          <div className="space-y-4">
            
            {/* Data Export */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col">
                <p className="font-medium text-gray-700 dark:text-gray-300">Export My Data</p>
                <p className="text-xs text-gray-400">Download a copy of all your profile, listing, and activity data (CSV format).</p>
              </div>
              <button
                type="button"
                onClick={handleDataExport}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Download size={16} /> Export
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex justify-between items-center py-3">
              <div className="flex flex-col">
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-xs text-gray-400">Permanently remove your account and all associated data. This action is irreversible.</p>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-100 border border-red-300 text-red-600 font-medium hover:bg-red-200 transition flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
        
        {/* --- SUBMIT ACTIONS --- */}
        <div className="flex justify-end pt-6">
          <button 
            type="submit"
            className="px-8 py-3 rounded-lg bg-[#533CDE] text-white font-medium hover:bg-[#432ebd] shadow-md shadow-indigo-200 transition"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}