import React, { useState } from 'react'; 
import { NavLink } from 'react-router-dom';
import { logoutTM } from '../../../Features/TheaterAdminActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal'; // Import the modal

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutTM());
    console.log('in handle logout')
    navigate('/theaterAdmin');
  };

  const openChangePasswordModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white w-64 p-4 fixed top-0 left-0">
      <div className="mb-8">
        <NavLink
          to="/theaterAdmin/home"
          className="text-2xl font-bold"
          activeClassName="text-yellow-400"
        >
          Dashboard
        </NavLink>
      </div>
      <nav className="flex flex-col space-y-4"> 
        <NavLink
          to="/theaterAdmin/viewScreens"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Manage Screens
        </NavLink>        
        
        <NavLink
          to="/theaterAdmin/showTimings"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Show Timings
        </NavLink>
        <NavLink
          to="/theaterAdmin/viewBookings"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          View Bookings
        </NavLink>
        <button
          onClick={openChangePasswordModal}
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 text-left"
        >
          Change Password
        </button>
        <button
          onClick={handleLogout}
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 text-left"
        >
          Logout
        </button>
      </nav>

      {isModalOpen && <ChangePasswordModal closeModal={closeModal} />}
    </div>
  );
}

export default Navbar;
