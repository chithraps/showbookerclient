import React from 'react';
import { NavLink } from 'react-router-dom';
import { logoutSuperAdmin } from '../../../Features/AdminActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSuperAdmin());
    navigate('/admin');
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white w-64 p-4 fixed top-0 left-0">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/viewUser"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          View Users
        </NavLink>
       
        <NavLink
          to="/admin/viewTheaters"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          View Theaters
        </NavLink>
        <NavLink
          to="/admin/addTheater"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Theaters
        </NavLink>
        <NavLink
          to="/admin/addTheaterManager"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Create Theater Manager
        </NavLink>
        <NavLink
          to="/admin/viewBookings"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          View Bookings
        </NavLink>
        <NavLink
          to="/admin/manageFeedback"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Manage Feedback
        </NavLink>
        <NavLink
          to="/admin/salesReport"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Sales Report 
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 text-left"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
