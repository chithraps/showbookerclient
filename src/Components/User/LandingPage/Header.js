import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Register from "./Register";
import LocationModal from "../Location/LocationModal";


function Header() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };
  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };
  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };
  return (
    <nav className="bg-red-50 p-1">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-20 mr-3">
            <img src="/showbooker.png" alt="Logo" className="w-full h-auto" />
          </div>
        </div>

        <div className="ml-2 relative">
          <input
            type="text"
            placeholder="Search here"
            className="w-96 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-6 ">
          <button className="bg-red-50 text-slate-950 px-2 py-1 rounded-md transition duration-300" onClick={openLocationModal}>
            Location
          </button>

          <button className="bg-red-50 text-slate-950 px-2 py-1 rounded-md font-semibold hover:bg-red-200 transition duration-300" onClick={openRegisterModal}>
            Sign in
          </button>
          
        </div>
      </div>
      {/* Register Modal */}
      <Register isOpen={isRegisterModalOpen} onClose={closeRegisterModal}/>
     {/* Location Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={closeLocationModal} />
    </nav>
  );
}

export default Header;
