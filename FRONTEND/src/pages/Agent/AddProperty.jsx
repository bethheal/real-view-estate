import { useState } from "react";
import { api } from "../../config/axios"; 

// Reusable Tailwind CSS classes for a professional input field
const INPUT_CLASS =
  "w-full p-3 rounded-lg border border-gray-300 bg-white " +
  "placeholder:text-gray-400 text-gray-900 " +
  "hover:border-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-[#F37A2A] focus:border-transparent mt-1";

// Define the steps for the form
const formSteps = [
  "Property Details",
  "Property Price",
  "Property Image",
  "Review & Next", // Renamed final step for clarity
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

  // --- Validation Logic (Same as before) ---
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

  // --- Handlers (Simplified for this example) ---
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
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  // --- New Handler for starting over ---
  function handleAddAnother() {
      // Resets the state for a new property submission
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
  }

  // NOTE: You must update this to route to your actual Drafts page path!
  function handleViewDrafts() {
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
      // Assuming your API now saves the property with a 'draft' or 'pending' status
      const res = await api.post("/agent/properties", formData, {
        headers: { "Content-Type": "multipart/form-Type" },
      });

      // Show alert and move to the final confirmation step
      alert("Property saved to drafts and submitted for review!");
      setCurrentStep(4); 
    } catch (err) {
      console.error(err);
      alert("Failed to save property");
    }
  }

  // --- Step Content Renderers (Omitted 1, 2, 3 for brevity, as they were in the last response) ---
  // ... (renderStepOne, renderStepTwo, renderStepThree here)

  // --- RENDER STEP FOUR (UPDATED) ---
  const renderStepFour = () => (
    <div className="text-center p-10 bg-yellow-50 rounded-lg border border-yellow-200">
      <h3 className="text-2xl font-bold text-yellow-700 mb-4">
        ✅ Property Submitted for Review!
      </h3>
      <p className="text-gray-700 mb-6">
        Your property, **{form.unitName || "Untitled Property"}**, has been saved to your **Drafts** and is now **under internal review** by the RealView team.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        You will be notified once it is approved and published or if any changes are required.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
              onClick={handleAddAnother}
              className="px-6 py-3 bg-[#F37A2A] text-white rounded-lg hover:bg-orange-500 font-semibold transition duration-150 shadow-md"
          >
              + Add Another Property
          </button>
          <button
              onClick={handleViewDrafts}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition duration-150 shadow-md"
          >
              View My Drafts
          </button>
      </div>
    </div>
  );
  
  // --- Main Render Function (including placeholders for other render functions) ---
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-lg">
      
      {/* Header and Step Navigation */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Configure Your Accomodation
        </h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">Cancel</button>
          {currentStep < 4 && (
            <button
              onClick={handleNext}
              className={`flex items-center text-white px-4 py-2 rounded-lg font-semibold transition duration-150 
                ${isStepValid(currentStep) 
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!isStepValid(currentStep)}
            >
              Next
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          )}
        </div>
      </div>

      {/* Steps Indicator (Same logic as before) */}
      <div className="flex justify-between items-center mb-8">
        {formSteps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompletedAndValid = stepNumber < currentStep && isStepValid(stepNumber);
          const isClickable = stepNumber <= currentStep;
          
          let bgColor = "bg-gray-300";
          if (isCompletedAndValid) {
            bgColor = "bg-[#F37A2A]"; 
          } else if (isActive) {
            bgColor = "bg-[#F37A2A]"; 
          }

          return (
            <div
              key={stepNumber}
              className={`flex-1 text-center ${index < formSteps.length - 1 ? 'relative' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-semibold ${
                    isClickable ? "cursor-pointer" : "cursor-default" 
                } ${bgColor}`}
                onClick={() => isClickable && handleStepClick(stepNumber)}
              >
                {stepNumber}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {label}
              </span>
              {index < formSteps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 transform -translate-x-1/2 -z-10 ${
                    isCompletedAndValid ? "bg-[#F37A2A]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Note: Place the original renderStepOne, Two, and Three functions here */}
          {currentStep === 1 && <RenderStepOne form={form} handleChange={handleChange} INPUT_CLASS={INPUT_CLASS} />}
          {currentStep === 2 && <RenderStepTwo form={form} handleChange={handleChange} INPUT_CLASS={INPUT_CLASS} />}
          {currentStep === 3 && <RenderStepThree images={images} handleImageUpload={handleImageUpload} handleSubmit={handleSubmit} isStepValid={isStepValid} />}
          {currentStep === 4 && renderStepFour()}
        </div>

        {/* Property Preview Panel (omitted for brevity, but it remains the same) */}
        <div className="md:col-span-1 bg-gray-50 border p-4 rounded-lg h-min sticky top-4">
            {/* ... (Previous Preview Panel code goes here) ... */}
            <div className="flex justify-between items-center mb-4">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                For {form.type}
                </span>
                <div className="text-gray-500 cursor-pointer">...</div>
            </div>
            
            <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 mb-4 overflow-hidden">
                {images.length > 0 ? (
                <img
                    src={URL.createObjectURL(images[0])}
                    alt="Property Preview"
                    className="w-full h-full object-cover" 
                />
                ) : (
                <span className="text-gray-500">
                    [Image preview placeholder]
                </span>
                )}
            </div>

            {images.length > 0 && (
                <p className="text-sm text-gray-500 text-center mb-2">
                    {images.length} image(s) uploaded
                </p>
            )}

            <h4 className="text-lg text-[#FF6900] font-bold mb-1">
                {form.unitName || "Untitled Property"}
            </h4>
            <p className="text-sm text-gray-500 mb-3">
                {form.location || "Location not specified"}
            </p>

            <div className="flex space-x-4 text-sm text-gray-400 border-t pt-3 mt-3">
                <p>🛏️ 3</p>
                <p>🛁 3</p>
                <p>📐 {form.dimensions || "Dimensions required"}</p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 text-[#FF6900] rounded-lg text-sm">
                <p>
                **ⓘ This is a preview when your property is published**
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components for Cleanliness ---
// Since the component got very large, I'm converting steps 1, 2, and 3 into helper components
// You'll need to define these helper components below the main AddProperty function or in separate files.

const RenderStepOne = ({ form, handleChange, INPUT_CLASS }) => (
    <>
      <div className="space-y-6">
        <h3 className="text-xl text-gray-800 font-semibold mb-4">General Information</h3>
        <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className={INPUT_CLASS}>
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                </select>
            </div>
            {/* Property Type */}
            <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Property Type</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className={INPUT_CLASS}>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                </select>
            </div>
        </div>
        {/* Unit Name */}
        <div>
            <label className="text-sm font-medium text-gray-700">Unit Name</label>
            <input type="text" name="unitName" value={form.unitName} onChange={handleChange} placeholder="east legon hills" className={INPUT_CLASS} required />
        </div>
        {/* Description */}
        <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Enter a description..." className={INPUT_CLASS} required></textarea>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pt-4">Unit Location</h3>
        {/* Street Address */}
        <div>
            <label className="text-sm font-medium text-gray-700">Street Address</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="211-17 47th Avenue, Lakeside, GH" className={INPUT_CLASS} required />
        </div>
        {/* Dimensions */}
        <div>
            <label className="text-sm font-medium text-gray-700">Dimensions (sqft / acres)</label>
            <input type="text" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="Example: 1200 sqft or 1.5 acres" className={INPUT_CLASS} required />
        </div>
      </div>
    </>
);

const RenderStepTwo = ({ form, handleChange, INPUT_CLASS }) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing Details</h3>
      <div>
        <label className="text-sm font-medium text-gray-700">Price (GHS)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Enter the listing price" className={INPUT_CLASS} required />
      </div>
    </div>
);

const RenderStepThree = ({ images, handleImageUpload, handleSubmit, isStepValid }) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Images</h3>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Upload Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37A2A]" required />
        <p className="text-sm text-gray-500 mt-2">
          Upload clear, high-resolution images. ({images.length} file(s) selected)
        </p>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full p-3 bg-[#F37A2A] text-white rounded-lg hover:bg-orange-500 font-semibold transition duration-150"
          disabled={!isStepValid(3)} 
        >
          {isStepValid(3) ? "Submit Property" : "Please Upload Images to Submit"}
        </button>
      </div>
    </div>
);