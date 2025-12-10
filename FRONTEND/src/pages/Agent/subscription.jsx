import React, { useState } from 'react';
import { CheckCircle, Zap, Shield, TrendingUp, DollarSign, X } from 'lucide-react';

// --- DUMMY SUBSCRIPTION DATA ---
const SUBSCRIPTION_PLANS = [
    {
        id: 'basic',
        name: 'Basic Agent',
        priceMonthly: 100, // GHS
        priceAnnual: 1000, // GHS (10% discount)
        color: 'border-gray-300',
        bg: 'bg-white',
        features: [
            '5 Active Property Listings',
            'Full Lead Contact Details',
            'Photo & Basic Video Uploads',
            'Standard Email Support',
        ],
        notIncluded: [
            'Featured Listing Slots',
            'Performance Analytics Dashboard',
            'Custom Agent Branding',
        ],
    },
    {
        id: 'pro',
        name: 'Pro Agent',
        tag: 'Recommended',
        priceMonthly: 250, // GHS
        priceAnnual: 2500, // GHS (16.6% discount)
        color: 'border-[#F37A2A]', // Your Brand Color
        bg: 'bg-orange-50',
        icon: Zap,
        features: [
            'Unlimited Active Property Listings',
            '**Dedicated Leads Dashboard**',
            'Featured Listing Slots (2)',
            'Priority Customer Support',
            'Advanced Performance Analytics',
        ],
        notIncluded: [
            'Custom Agent Branding',
        ],
    },
    {
        id: 'premium',
        name: 'Premium Partner',
        priceMonthly: 500, // GHS
        priceAnnual: 4800, // GHS (20% discount)
        color: 'border-blue-600',
        bg: 'bg-blue-50',
        icon: Shield,
        features: [
            'Unlimited Listings & Priority Review',
            'Dedicated Leads Dashboard',
            'Featured Listing Slots (5)',
            '24/7 Phone Support',
            '**Custom Agent Branding on Listings**',
        ],
        notIncluded: [],
    },
];

export default function SubscriptionPlans() {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

    // --- Paystack Integration Placeholder ---
    const handleSubscription = (planId) => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
        const totalAmount = price * 100; // Paystack requires amount in Cedi Pesewas (e.g., 250 GHS = 25000)

        // 1. You would typically make an API call here to create a transaction reference on your server
        //    (to prevent front-end manipulation).
        // 2. The server sends back a unique transaction reference and the agent's email.
        
        console.log(`--- Initiating Paystack Payment for ${plan.name} (${billingCycle}) ---`);
        console.log(`Amount: GHS ${price.toLocaleString()}. Pesewas: ${totalAmount}`);
        console.log(`Plan ID: ${planId}`);
        
        // --- !!! PLACEHOLDER FOR PAYSTACK HANDLER !!! ---
        
        // In a real application, you would use one of the following methods:
        // A) Call a custom Paystack hook/function: initializePayment({ reference, email, amount, ... })
        // B) Redirect to a server-generated Paystack URL.
        
        alert(`Redirecting to Paystack for ${plan.name} (${billingCycle}). Total: GHS ${price.toLocaleString()}`);
        
        // window.location.href = "YOUR_PAYSTACK_INIT_URL";
    };

    // Helper function for calculation savings text
    const getSavingsText = (planId, priceMonthly, priceAnnual) => {
        if (planId === 'basic') return null; // Basic savings calculation is less prominent

        const monthlyTotal = priceMonthly * 12;
        const annualSavings = monthlyTotal - priceAnnual;

        // Custom calculation based on DUMMY data for specific plans
        let savingsText = `Save GHS ${annualSavings.toLocaleString()}`;
        
        // If you want to use the provided dummy saving text explicitly:
        if (planId === 'pro') savingsText = 'Save GHS 500'; 
        if (planId === 'premium') savingsText = 'Save GHS 1200'; 

        return savingsText;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                    Choose Your Agent Success Plan
                </h1>
                <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
                    Unlock unlimited listings, advanced lead management, and more to grow your real estate business.
                </p>
            </header>

            {/* Billing Cycle Toggle - Responsive Spacing */}
            <div className="flex justify-center mb-10">
                <div className="relative p-1 bg-gray-100 rounded-full flex items-center shadow-inner">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition duration-300 ${
                            billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition duration-300 ${
                            billingCycle === 'annual' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Annual 
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                            Up to 20% OFF
                        </span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards Grid - Key Responsiveness Change: grid-cols-1 by default */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {SUBSCRIPTION_PLANS.map((plan) => (
                    <div 
                        key={plan.id}
                        className={`relative rounded-2xl border-4 ${plan.color} ${plan.bg} p-6 sm:p-8 flex flex-col shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                    >
                        {/* Tag/Header */}
                        {plan.tag && (
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-[#F37A2A] text-white text-xs font-bold uppercase py-1 px-3 rounded-full shadow-md">
                                {plan.tag}
                            </div>
                        )}
                        
                        {/* Plan Name */}
                        <div className="flex items-center gap-3 mb-6">
                            {plan.icon && <plan.icon size={30} className="text-[#F37A2A]" />}
                            <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
                        </div>
                        
                        {/* Price Display */}
                        <div className="mb-8">
                            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                                ₵{billingCycle === 'monthly' ? plan.priceMonthly.toLocaleString() : plan.priceAnnual.toLocaleString()}
                            </span>
                            <span className="text-xl text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>

                        {/* Features List - flex-grow ensures buttons align at the bottom */}
                        <ul className="flex-grow space-y-3 mb-8">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-gray-700 text-sm sm:text-base">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1 mr-2" />
                                    <p dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                            ))}
                            {/* Not Included Features (for clarity) */}
                            {plan.notIncluded.map((feature, index) => (
                                <li key={`no-${index}`} className="flex items-start text-gray-400 line-through text-sm sm:text-base">
                                    <X size={20} className="text-red-400 flex-shrink-0 mt-1 mr-2" />
                                    <p dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                            ))}
                        </ul>

                        {/* Call to Action Button */}
                        <button
                            onClick={() => handleSubscription(plan.id)}
                            className={`w-full py-3 rounded-xl text-lg font-bold transition duration-300 shadow-md 
                                ${plan.id === 'pro' 
                                    ? 'bg-[#F37A2A] text-white hover:bg-orange-600'
                                    : 'bg-gray-800 text-white hover:bg-gray-900'
                                }`}
                        >
                            <DollarSign size={20} className="inline-block mr-2" />
                            Subscribe Now
                        </button>

                        {/* Annual Savings Text */}
                         {billingCycle === 'annual' && plan.id !== 'basic' && (
                             <p className="mt-3 text-center text-sm text-gray-500">
                                {getSavingsText(plan.id, plan.priceMonthly, plan.priceAnnual)} with Annual Billing!
                             </p>
                         )}
                    </div>
                ))}
            </div>

            {/* Footer Trust Section - Responsive layout for trust info */}
            <footer className="mt-16 text-center text-gray-500">
                <p className="text-lg font-semibold mb-3">Secure Payments Powered By:</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <Shield size={20} className="text-green-500" />
                        <span className="font-bold text-gray-700">Paystack</span>
                    </div>
                    
                    <p className="text-sm border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 ml-0 sm:ml-3 pl-0 sm:pl-3 max-w-sm sm:max-w-none">
                        Cancel anytime. 30-day money-back guarantee (Pro/Premium).
                    </p>
                </div>
            </footer>
        </div>
    );
}