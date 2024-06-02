import React from 'react';


function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Image */}
        <div className="flex items-center">
        <img src="/showbooker.png" alt="Logo" className="w-20 mr-3" />
          <p>&copy; {new Date().getFullYear()} showbooker. All rights reserved.</p>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col text-left">
          <h3 className="font-bold mb-2">Contact Us</h3>
          <p>Location</p>
          <p>Email: contact@showbooker.com</p>
        </div>

        {/* Links */}
        <div className="flex flex-col">
          <a href="/about" className="mb-2 hover:underline">About Us</a>
          <a href="/services" className="mb-2 hover:underline">Services</a>
          <a href="/privacy" className="mb-2 hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer