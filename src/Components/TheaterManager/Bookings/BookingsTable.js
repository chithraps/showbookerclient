import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import { useSelector } from 'react-redux';

function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const theaterAdmin = useSelector((state) => state.theaterAdmin); 
  const theaterId = theaterAdmin.theaterAdmin.theaterId;
  const token = theaterAdmin.theaterAdminAccessToken;

  const fetchBookings = async (page = 1) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/tmAdmin/viewBookings/${theaterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page, 
          limit: 10, 
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
    fetchBookings();
  }, [theaterId]);

  // Handler for changing pages
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBookings(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">No bookings available for this theater.</div>
      ) : (
        <>
          <div className="overflow-x-auto h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">User Email</th>
                  <th className="py-2 px-4">Movie</th>
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
                    <td className="py-2 px-4">{booking.screenId.screen_number}</td>               
                    <td className="py-2 px-4">{new Date(booking.showDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{booking.showTime}</td>
                    <td className="py-2 px-4">{booking.totalPrice}</td>
                    <td className="py-2 px-4">{booking.payment.status}</td>
                    <td className="py-2 px-4">{booking.status}</td>
                    <td className="py-2 px-4">
                      {new Date(booking.createdAt).toLocaleDateString()} 
                    </td>
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
              className={`px-4 py-2 ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingsTable;
