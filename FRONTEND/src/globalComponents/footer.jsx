import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#887232] text-white pt-12 pb-6 px-6 lg:px-20 relative">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold mb-3">
            Real<span className="text-[#fff6b6]">View</span>
          </h3>
          <p className="text-white/90 leading-relaxed mb-4">
            Connecting people with the best properties across Ghana.  
            Your dream home is just a click away.
          </p>
          <div className="flex gap-4">
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <FaInstagram />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <FaTwitter />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-white/90">
            <li>
              <Link to="/" className="hover:text-[#fff6b6] transition">Home</Link>
            </li>
            <li>
              <Link to="/properties" className="hover:text-[#fff6b6] transition">Properties</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-[#fff6b6] transition">Services</Link>
            </li>
            <li>
              <Link to="/help-center" className="hover:text-[#fff6b6] transition">FAQ / Help</Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-[#fff6b6] transition">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Our Services</h4>
          <ul className="space-y-2 text-white/90">
            <li>Property Sales</li>
            <li>Rentals & Leasing</li>
            <li>Property Management</li>
            <li>Consulting</li>
            <li>Property Valuation</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-white/90">
            <li>📍 12 Real Estate Ave, East Legon, Accra</li>
            <li>📞 +233 55 123 4567</li>
            <li>✉️ support@realview.com</li>
            <li>🌐 www.realview.com</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/30 my-4"></div>

      {/* Bottom Section */}
      <div className="text-center text-sm text-white/80 relative">
        © {new Date().getFullYear()} RealView. All Rights Reserved.  
        <span className="block md:inline"> | Designed with ❤️ by the Real View Team.</span>

        {/* Admin Button - subtle, bottom-right corner */}
        <button
          onClick={() => navigate("/admin/login")}
          className="absolute right-0 bottom-0 mb-2 mr-2 bg-white/20 text-white px-3 py-1 rounded hover:bg-white/40 text-xs transition"
        >
          Admin
        </button>
      </div>
    </footer>
  );
};

export default Footer;
