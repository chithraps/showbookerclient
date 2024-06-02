import React from 'react';
import { NavLink } from 'react-router-dom';
import { logoutTM } from '../../../Features/TheaterAdminActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutTM());
    navigate('/theaterAdmin');
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white w-64 p-4 fixed top-0 left-0">
      <div className="mb-2">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <nav className="flex flex-col"> 
      
        <NavLink
          to="/theaterAdmin/addScreen"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Screen
        </NavLink>
        <NavLink
          to="/theaterAdmin/editTheater"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Edit Theater
        </NavLink>
        <NavLink
          to="/theaterAdmin/editScreen"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Edit Screen
        </NavLink>
        <NavLink
          to="/theaterAdmin/addSeatingLayout"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Seating Layout
        </NavLink>
        <NavLink
          to="/theaterAdmin/editSeatingLayout"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Edit Seating Layout
        </NavLink>
        <NavLink
          to="/theaterAdmin/addRows"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Rows
        </NavLink>
        <NavLink
          to="/theaterAdmin/editRows"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Edit Rows
        </NavLink>
        <NavLink
          to="/theaterAdmin/addSections"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Sections
        </NavLink>
        <NavLink
          to="/theaterAdmin/editSections"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Edit Sections
        </NavLink>
        <NavLink
          to="/theaterAdmin/addSeats"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Seats
        </NavLink>
        <NavLink
          to="/theaterAdmin/editSeats"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Edit Seats
        </NavLink>
        <NavLink
          to="/theaterAdmin/addGenre"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Genre
        </NavLink>
        <NavLink
          to="/theaterAdmin/viewMovies"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          View Movies
        </NavLink>
        <NavLink
          to="/theaterAdmin/addMovie"
          className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
          activeClassName="bg-gray-900"
        >
          Add Movie
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
