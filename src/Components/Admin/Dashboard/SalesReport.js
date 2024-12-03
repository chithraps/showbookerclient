import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";

function SalesReport() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); 
  const [filteredBookings, setFilteredBookings] = useState([]);
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin?.adminAccessToken;
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/bookings`, {
          params: { status: statusFilter } ,
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        setBookings(response.data);
        console.log("response ",response.data)
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [statusFilter]); 

  useEffect(() => {
   
    if (statusFilter) {
      setFilteredBookings(bookings.filter(booking => booking.status === statusFilter));
    } else {
      setFilteredBookings(bookings);
    }
  }, [bookings, statusFilter]);

  
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64 p-5 space-y-6">
        <div className="mb-6">
          <label htmlFor="statusFilter" className="mr-2">Filter by Booking Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">User Email</th>
              <th className="border px-4 py-2">Movie</th>
              <th className="border px-4 py-2">Theater</th>
              <th className="border px-4 py-2">Show Date</th>
              <th className="border px-4 py-2">Show Time</th>
              <th className="border px-4 py-2">Seats</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Payment Status</th>
              <th className="border px-4 py-2">Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border px-4 py-2">{booking.userEmail}</td>
                  <td className="border px-4 py-2">{booking.movieId?.title}</td>
                  <td className="border px-4 py-2">{booking.theaterId?.name}</td>
                  <td className="border px-4 py-2">{new Date(booking.showDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{booking.showTime}</td>
                  <td className="border px-4 py-2">
                    {booking.seatIds.map((seat, index) => (
                      <div key={index}>{seat.seatId?.seatNumber} ({seat.status})</div>
                    ))}
                  </td>
                  <td className="border px-4 py-2 flex items-center"><MdCurrencyRupee />{booking.totalPrice}</td>
                  <td className="border px-4 py-2">{booking.payment.status}</td>
                  <td className="border px-4 py-2">{booking.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesReport;
