import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    theaterName,
    movieName,
    screenNumber,
    seats,
    showDate,
    showTime,
    totalPrice,
    totalAmount,
    transactionId,
    bookingInfo,
  } = location.state || {};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 w-full py-6 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">Booking Confirmation</h1>
      </header>

      {/* Booking Details Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Your Booking Details
        </h2>

        {/* Details Section */}
        <div className="flex justify-between">
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">
              <span className="font-semibold">Booking ID:</span>{" "}
              {bookingInfo.bookingId}
            </p>
            <p className="font-medium">
              <span className="font-semibold">Theater:</span> {theaterName}
            </p>
            <p className="font-medium">
              <span className="font-semibold">Screen:</span> {screenNumber}
            </p>

            <p className="font-medium">
              <span className="font-semibold">Movie:</span> {movieName}
            </p>

            <p className="font-medium">
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(showDate)}
            </p>

            <p className="font-medium">
              <span className="font-semibold">Time:</span> {showTime}
            </p>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Seats:</h3>
              <ul className="space-y-2">
                {seats.map((seat, index) => (
                  <li key={index} className="text-gray-600">
                    <span className="font-medium text-gray-800">
                      {seat.seating_layout.class_name}
                    </span>{" "}
                    - Row: {seat.row_name}, Seat: {seat.seat_number}
                  </li>
                ))}
              </ul>
            </div>

            <p className="font-medium">
              <span className="font-semibold">Total Price:</span> ₹{totalPrice}
            </p>
            <p className="font-medium">
              <span className="font-semibold">Total Amount (incl. Fee):</span> ₹
              {totalAmount}
            </p>
            <p className="font-medium">
              <span className="font-semibold">Transaction ID:</span>{" "}
              {transactionId}
            </p>
          </div>
          <div>
            {bookingInfo.qrCode ? (
              <img
                src={bookingInfo.qrCode} 
                alt="QR Code"
                className="w-48 h-48 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-sm text-gray-500">No QR Code available</p>
            )}
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            className="px-8 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300 focus:outline-none"
            onClick={handleButtonClick}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
