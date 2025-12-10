import { useState } from "react";
import { api } from "../../config/axios"; 

// UPDATED: Added 'text-base' to prevent iOS zoom on focus, 
// and adjusted margins/sizing for mobile consistency.
const INPUT_CLASS =
  "w-full p-3 rounded-lg border border-gray-300 bg-white " +
  "placeholder:text-gray-400 text-gray-900 text-base " + // text-base is crucial for mobile
  "hover:border-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-[#F37A2A] focus:border-transparent mt-1 transition-shadow";

const formSteps = [
  "Details", // Shortened for mobile
  "Price",
  "Images",
  "Review",
];

export default function AddProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    unitName: "",
    description: "",
    type: "Sale",
    propertyType: "Apartment",
    price: "",
    location: "",
    dimensions: "",
  });
  const [images, setImages] = useState([]);

  // --- Validation Logic ---
  const isStepValid = (stepNumber) => {
    if (stepNumber === 1) {
      return !!form.unitName && !!form.description && !!form.location && !!form.dimensions;
    } else if (stepNumber === 2) {
      return !!form.price && !isNaN(parseFloat(form.price)) && parseFloat(form.price) > 0;
    } else if (stepNumber === 3) {
      return images.length > 0;
    }
    return true; 
  };

  // --- Handlers ---
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    setImages([...e.target.files]);
  }

  function handleStepClick(stepNumber) {
    if (stepNumber <= currentStep) {
        setCurrentStep(stepNumber);
    }
  }

  function handleNext() {
    if (!isStepValid(currentStep)) {
      alert("Please fill in all required fields to proceed.");
      return;
    }
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
      // Scroll to top on mobile when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // New Additions for handling "Add Another" and "View Drafts"
  function handleAddAnother() {
      setForm({
          unitName: "",
          description: "",
          type: "Sale",
          propertyType: "Apartment",
          price: "",
          location: "",
          dimensions: "",
      });
      setImages([]);
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleViewDrafts() {
      // Replace with your actual routing logic (e.g., navigate('/agent/drafts'))
      window.location.href = '/agent/drafts'; 
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (currentStep !== 3) return; 

    if (!isStepValid(3)) {
         alert("Please upload at least one image to submit the property.");
         return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // const res = await api.post("/agent/properties", formData, ...);
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(4); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert("Failed to save property");
    }
  }

  // --- RENDER STEP FOUR (RESPONSIVE UPDATE) ---
  const renderStepFour = () => (
    <div className="text-center p-6 md:p-10 bg-yellow-50 rounded-lg border border-yellow-200">
      <h3 className="text-xl md:text-2xl font-bold text-yellow-700 mb-4">
        ✅ Property Submitted!
      </h3>
      <p className="text-gray-700 mb-6 text-sm md:text-base">
        Your property, <strong>{form.unitName || "Untitled Property"}</strong>, has been saved to your Drafts and is under review.
      </p>
      
      {/* Buttons stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
              onClick={handleAddAnother}
              className="w-full sm:w-auto px-6 py-3 bg-[#F37A2A] text-white rounded-lg hover:bg-orange-500 font-semibold transition duration-150 shadow-md"
          >
              + Add Another
          </button>
          <button
              onClick={handleViewDrafts}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 font-semibold transition duration-150 shadow-sm"
          >
              View Drafts
          </button>
      </div>
    </div>
  );
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white md:shadow-xl md:rounded-lg">
      
      {/* HEADER: Flex column on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Add Property
        </h1>
        
        <div className="flex w-full sm:w-auto justify-between sm:justify-end items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2">Cancel</button>
          {currentStep < 4 && (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className={`flex items-center text-white px-5 py-2.5 rounded-lg font-semibold transition duration-150 text-sm shadow-sm
                ${isStepValid(currentStep) 
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Next
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          )}
        </div>
      </div>

      {/* STEPPER: Responsive Labels */}
      <div className="flex justify-between items-center mb-8 px-2">
        {formSteps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep && isStepValid(stepNumber);
          const isClickable = stepNumber <= currentStep;
          
          let bgColor = "bg-gray-200 text-gray-500";
          if (isCompleted || isActive) {
            bgColor = "bg-[#F37A2A] text-white shadow-md shadow-orange-100"; 
          }

          return (
            <div
              key={stepNumber}
              className={`flex-1 text-center relative z-10`}
            >
              {/* Connector Line */}
              {index < formSteps.length - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 -translate-y-1/2
                  ${isCompleted ? "bg-[#F37A2A]" : "bg-gray-200"}`} 
                />
              )}

              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm md:text-base transition-all duration-300 ${
                    isClickable ? "cursor-pointer" : "cursor-default" 
                } ${bgColor}`}
                onClick={() => isClickable && handleStepClick(stepNumber)}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              
              {/* Labels: Hidden on very small screens, visible on Tablet/Desktop */}
              <span
                className={`text-xs md:text-sm block ${
                  isActive ? "text-gray-900 font-bold" : "text-gray-400 font-medium"
                } ${isActive ? "block" : "hidden sm:block"}`} // Only active label shows on tiny screens
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        
        {/* FORM SECTION: Spans 2 cols on Desktop, Full on Mobile */}
        <div className="md:col-span-2 space-y-6">
          {currentStep === 1 && <RenderStepOne form={form} handleChange={handleChange} INPUT_CLASS={INPUT_CLASS} />}
          {currentStep === 2 && <RenderStepTwo form={form} handleChange={handleChange} INPUT_CLASS={INPUT_CLASS} />}
          {currentStep === 3 && <RenderStepThree images={images} handleImageUpload={handleImageUpload} handleSubmit={handleSubmit} isStepValid={isStepValid} />}
          {currentStep === 4 && renderStepFour()}
        </div>

        {/* PREVIEW PANEL: Stacks at bottom on Mobile, Sticky on Desktop */}
        {/* Added 'md:sticky md:top-24' to stick only on desktop */}
        <div className="md:col-span-1 h-fit md:sticky md:top-6">
           <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Live Preview</h5>
            
            {/* Card Preview */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                    {images.length > 0 ? (
                    <img
                        src={URL.createObjectURL(images[0])}
                        alt="Preview"
                        className="w-full h-full object-cover" 
                    />
                    ) : (
                    <span className="text-xs">No Image</span>
                    )}
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {form.type.toUpperCase()}
                    </span>
                </div>

                <div className="p-3">
                    <div className="flex justify-between items-start">
                        <h4 className="text-base text-gray-800 font-bold truncate pr-2">
                            {form.unitName || "Property Name"}
                        </h4>
                        <p className="text-[#F37A2A] font-bold text-sm whitespace-nowrap">
                           {form.price ? `GH₵ ${parseInt(form.price).toLocaleString()}` : "GH₵ --"}
                        </p>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 truncate">
                        📍 {form.location || "Location"}
                    </p>

                    <div className="flex gap-3 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                        <span>🛏️ 3 bds</span>
                        <span>🛁 2 ba</span>
                        <span>📐 {form.dimensions || "--"}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded-lg text-xs flex items-start gap-2">
               <span className="text-lg leading-none">ⓘ</span>
               <p className="leading-tight">This preview updates in real-time as you fill out the form.</p>
            </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const RenderStepOne = ({ form, handleChange, INPUT_CLASS }) => (
    <div className="animate-fade-in-up">
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Listing Type</label>
                <select name="type" value={form.type} onChange={handleChange} className={INPUT_CLASS}>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className={INPUT_CLASS}>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                </select>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Property Title / Name</label>
            <input type="text" name="unitName" value={form.unitName} onChange={handleChange} placeholder="e.g. Luxury Villa in East Legon" className={INPUT_CLASS} />
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe the key features..." className={INPUT_CLASS}></textarea>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location / Address</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Street name, City" className={INPUT_CLASS} />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Size (sqft/acres)</label>
                <input type="text" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="e.g. 1200 sqft" className={INPUT_CLASS} />
            </div>
        </div>
      </div>
    </div>
);

const RenderStepTwo = ({ form, handleChange, INPUT_CLASS }) => (
    <div className="animate-fade-in-up">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Pricing</h3>
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
        <label className="text-sm font-medium text-gray-500 mb-2 block uppercase tracking-wide">Total Price (GHS)</label>
        <div className="relative max-w-xs mx-auto">
            <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₵</span>
            <input 
                type="number" 
                name="price" 
                value={form.price} 
                onChange={handleChange} 
                placeholder="0.00" 
                className={`${INPUT_CLASS} pl-8 text-center text-xl font-bold tracking-wider`} 
            />
        </div>
        <p className="text-xs text-gray-400 mt-2">Enter the final listing price inclusive of standard fees.</p>
      </div>
    </div>
);

const RenderStepThree = ({ images, handleImageUpload, handleSubmit, isStepValid }) => (
    <div className="animate-fade-in-up">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Gallery</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
        <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-100 text-[#F37A2A] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <p className="font-medium text-gray-700">Click to upload images</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, JPEG allowed</p>
        </div>
      </div>

      {images.length > 0 && (
          <div className="mt-6">
              <p className="text-sm font-bold text-gray-700 mb-3">{images.length} files selected:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from(images).map((img, i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                          <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="mt-8 pt-6 border-t">
        <button
          type="submit"
          onClick={handleSubmit}
          className={`w-full p-4 rounded-xl font-bold text-lg transition shadow-lg
            ${isStepValid(3) 
                ? "bg-[#F37A2A] text-white hover:bg-orange-600 hover:shadow-orange-200" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
          disabled={!isStepValid(3)} 
        >
          {isStepValid(3) ? "Submit Property Review" : "Upload images to continue"}
        </button>
      </div>
    </div>
);