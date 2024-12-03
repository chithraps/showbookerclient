import React from 'react'; 

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center space-y-6 md:space-y-0">
        {/* Logo or Image */}
        <div className="w-full md:w-auto flex items-center justify-center md:justify-start">
          <img src="/showbooker.png" alt="Logo" className="w-16 md:w-20 mr-3" />
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} showbooker. All rights reserved.
          </p>
        </div>

        {/* Contact Us */}
        <div className="w-full md:w-auto text-center md:text-left">
          <h3 className="font-bold mb-2">Contact Us</h3>
          <p>Location</p>
          <p>Email: contact@showbooker.com</p>
        </div>

        {/* Links */}
        <div className="w-full md:w-auto text-center md:text-left">
          <a href="/about" className="block mb-2 hover:underline">About Us</a>
          <a href="/services" className="block mb-2 hover:underline">Services</a>
          <a href="/privacy" className="block mb-2 hover:underline">Privacy Policy</a>
          <a href="/terms" className="block hover:underline">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
