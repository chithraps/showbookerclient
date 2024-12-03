import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locations, setLocations] = useState([]); // To store available locations
  const [selectedLocation, setSelectedLocation] = useState(''); // For storing the selected location
  const admin = useSelector((state) => state.admin);
  const token = admin.adminAccessToken;

  
  const fetchLocations = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/admin/getTheaterLocations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch bookings with optional location filter
  const fetchBookings = async (page = 1, location = '') => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/admin/viewAllBookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: 10,
          location, // Include location as a query param if it's selected
        },
      });
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchLocations(); 
    fetchBookings(); 
  }, []);

  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBookings(newPage, selectedLocation);
    }
  };

  
  const handleFilter = () => {
    fetchBookings(1, selectedLocation); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>

      {/* Location Filter */}
      <div className="mb-4">
        <label htmlFor="location" className="mr-2">Filter by Location:</label>
        <select
          id="location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply Filter
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">No bookings available.</div>
      ) : (
        <>
          <div className="overflow-x-auto h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">User Email</th>
                  <th className="py-2 px-4">Movie</th>
                  <th className="py-2 px-4">Theater</th>
                  <th className="py-2 px-4">Screen</th>
                  <th className="py-2 px-4">Show Date</th>
                  <th className="py-2 px-4">Show Time</th>
                  <th className="py-2 px-4">Total Price</th>
                  <th className="py-2 px-4">Payment Status</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Booking Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="py-2 px-4">{booking.userEmail}</td>
                    <td className="py-2 px-4">{booking.movieId.title}</td>
                    <td className="py-2 px-4">{booking.theaterId.name}</td>
                    <td className="py-2 px-4">{booking.screenId.screen_number}</td>
                    <td className="py-2 px-4">{new Date(booking.showDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{booking.showTime}</td>
                    <td className="py-2 px-4">{booking.totalPrice}</td>
                    <td className="py-2 px-4">{booking.payment.status}</td>
                    <td className="py-2 px-4">{booking.status}</td>
                    <td className="py-2 px-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingTable;
