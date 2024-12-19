import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { RxDropdownMenu } from "react-icons/rx";
import Register from "./Register";
import LocationModal from "../Location/LocationModal";
import Dropdown from "../HeaderAL/Dropdown";
import { logoutUser } from "../../../Features/UserActions";
import { selectLocation } from "../../../Features/LocationSlice";
import SearchModal from "./SearchModal";
import WalletModal from "./WalletModal"; // Import the WalletModal

function Header() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const selectedLocation = useSelector(selectLocation);

  useEffect(() => {
    console.log("selected location ", selectedLocation);
    if (selectedLocation === "Location") {
      setIsLocationModalOpen(true);
    }
  }, [selectedLocation]);
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

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  const handleBookingHistory = () => {
    navigate("/booking-history");
  };

  const handleWallet = () => {
    setIsWalletModalOpen(true); // Open the WalletModal
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false); // Close the WalletModal
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="bg-red-50 p-2">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <img
            src="/showbooker.png"
            alt="Logo"
            className="w-16 sm:w-20 h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-auto" onClick={openSearchModal}>
          <input
            type="text"
            placeholder="Search here"
            className="w-full sm:w-96 px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            readOnly
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        {/* Location and Dropdown */}
        <div className="flex items-center space-x-4 flex-wrap sm:flex-nowrap">
          <button
            className="bg-red-50 text-slate-950 px-3 py-2 rounded-md hover:bg-red-200 transition duration-300"
            onClick={openLocationModal}
          >
            {selectedLocation}
          </button>

          {user && user.user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                Hi, {user.user.firstName || "User"}
              </span>
              <Dropdown label={<RxDropdownMenu className="text-gray-700" />}>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleEditProfile}
                >
                  Profile
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleBookingHistory}
                >
                  Booking History
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleWallet}
                >
                  Wallet
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </Dropdown>
            </div>
          ) : (
            <button
              className="bg-red-50 text-slate-950 px-3 py-2 rounded-md font-semibold hover:bg-red-200 transition duration-300"
              onClick={openRegisterModal}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
      {/* Modals */}
      <Register isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        setSelectedLocation={() => {}}
      />
      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        userId={user?.user?.id}
      />
    </nav>
  );
}

export default Header;
