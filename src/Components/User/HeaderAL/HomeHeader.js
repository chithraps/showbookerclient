import React from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { FaSearch } from "react-icons/fa";
import { RxDropdownMenu } from "react-icons/rx";
import {logoutUser} from '../../../Features/UserActions';
import { useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
function HomeHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user)
  console.log(user.user.firstName);
  const handleEditProfile = () => {
    // Handle edit profile action
    console.log('Edit Profile clicked');
  };

  const handleBookings = () => {
    // Handle bookings action
    console.log('Bookings clicked');
    navigate('/edit-profile')
  };

  const handleLogout = () => {
    // Handle logout action
    console.log('Logout clicked');
    dispatch(logoutUser())
    navigate('/')
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
          <button className="bg-red-50 text-slate-950 px-2 py-1 rounded-md transition duration-300">
            Location
          </button>

          {/* Display user's first name if available */}
          {user && (
            <div className="flex items-center space-x-2">
              <span className="mr-1">Hi, {user.user.firstName ? user.user.firstName : 'User'}</span>
              <Dropdown label={<RxDropdownMenu  className="text-gray-700" />}>
                <button
                  onClick={handleEditProfile}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleBookings}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Bookings
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </Dropdown>
            </div>
          )}
          
        </div>
      </div>
      {/* Register Modal */}
      
     
    </nav>
  )
}

export default HomeHeader