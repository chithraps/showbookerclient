import React, { useState, useEffect } from "react";
import Header from "../LandingPage/Header";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import RateReviewModal from "../RateAndReviewMovie/RateAndReviewModal";
import { logoutUser } from "../../../Features/UserActions";

function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [seatQUantity, setSeatQuantity] = useState(0);
  const [isRateReviewModalOpen, setIsRateReviewModalOpen] = useState(false);
  const [movieId, setMovieId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = user.user.email;
  const userId = user.user.id;
  const token = user.accessToken;

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/bookingHistory/${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookingHistory(response.data.bookings);
        setSeatQuantity(response.data.bookedSeatCount);
      } catch (error) {
        setError("Error fetching booking history");
        console.error("Error fetching booking history:", error);
        if (error.response.data.message === "Unauthorized: Token has expired") {
          swal({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutUser());
              navigate("/");
            }
          });
        } else if (
          error.response.data.message === "User is blocked. Access denied."
        ) {
          swal({
            title: "User Blocked",
            text: "Your account has been blocked. Please contact support for further assistance.",
            icon: "error",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutUser());
              navigate("/");
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchBookingHistory();
    }
  }, [userEmail]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.put(
        `${baseUrl}/cancelBooking/${bookingId}`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Booking canceled successfully") {
        swal("success", "Your booking is canceled");
        setBookingHistory((prevHistory) =>
          prevHistory.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "Canceled" }
              : booking
          )
        );
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };
  const handleCloseRateReviewModal = () => {
    setIsRateReviewModalOpen(false);
  };
  const handleRateReviewClick = (movieId) => {
    setMovieId(movieId);
    console.log(" movie id is ", movieId);
    setIsRateReviewModalOpen(true);
  };
  const handleCancelSeat = async (bookingId, seatId) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to cancel this seat?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willCancel) => {
      if (willCancel) {
        try {
          const baseUrl = process.env.REACT_APP_BASE_URL;
          const response = await axios.put(
            `${baseUrl}/cancelSeat`,
            { bookingId, seatId, userId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if (response.data.message === "Seat canceled successfully") {
            swal("Success", "The seat has been canceled", "success");
  
            setBookingHistory((prevHistory) =>
              prevHistory.map((booking) => {
                if (booking._id === bookingId) {
                  const updatedSeats = booking.seatIds.map((seat) =>
                    seat.seatId._id === seatId
                      ? { ...seat, status: "Canceled" }
                      : seat
                  );
  
                  const allSeatsCanceled = updatedSeats.every(
                    (seat) => seat.status === "Canceled"
                  );
  
                  return {
                    ...booking,
                    seatIds: updatedSeats,
                    status: allSeatsCanceled ? "Canceled" : booking.status,
                  };
                }
                return booking;
              })
            );
          }
        } catch (error) {
          console.error("Error canceling seat:", error);
          swal("Error", "Failed to cancel the seat. Please try again.", "error");
        }
      }
    });
  };
  

  const isBookingExpired = (showDate, showTime) => {
    try {
      const convertTo24HourFormat = (time) => {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");

        if (hours === "12") {
          hours = modifier === "AM" ? "00" : "12";
        } else if (modifier === "PM") {
          hours = String(Number(hours) + 12).padStart(2, "0");
        }
        return `${hours}:${minutes.padStart(2, "0")}`;
      };

      const formattedShowTime = convertTo24HourFormat(showTime);
      const bookingDateTime = new Date(
        `${showDate.split("T")[0]}T${formattedShowTime}:00`
      );
      const currentDateTime = new Date();
      console.log("Formatted Show DateTime:", bookingDateTime);
      console.log("Current DateTime:", currentDateTime);
      return currentDateTime > bookingDateTime;
    } catch (error) {
      console.error("Error parsing date or time:", error);
      return false;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Booking History</h2>

        {bookingHistory.length === 0 ? (
          <p className="text-center">No bookings found</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookingHistory.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col lg:flex-row mx-auto"
                style={{ maxWidth: "800px" }}
              >
                {/* Poster */}
                <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-4">
                  <img
                    src={booking.movieId.poster}
                    alt={booking.movieId.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2">
                    {booking.movieId.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Booking ID:</strong> {booking.bookingId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Theater:</strong>{" "}
                    {`${booking.theaterId.name}, ${booking.theaterId.location}, ${booking.theaterId.city}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Screen:</strong> {booking.screenId.screen_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Seats:</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {booking.seatIds.map((seat) => (
                      <li
                        key={seat.seatId._id}
                        className="text-sm text-gray-600"
                      >
                        {seat.seatId.row_id.row_name} - Seat{" "}
                        {seat.seatId.seat_number}
                        {seat.status === "Canceled" ? (
                          <span className="ml-2 text-red-600">Canceled</span>
                        ) : (
                          seat.status === "Booked" &&
                          !isBookingExpired(
                            booking.showDate,
                            booking.showTime
                          ) &&
                          booking.status === "Confirmed" && (
                            <button
                              onClick={() =>
                                handleCancelSeat(booking._id, seat.seatId._id)
                              }
                              className="ml-2 text-red-600 hover:underline"
                            >
                              Cancel Seat
                            </button>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600">
                    <strong>Show Date:</strong>{" "}
                    {new Date(booking.showDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Show Time:</strong> {booking.showTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total Price:</strong> ₹{booking.totalPrice}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-2 ${
                      booking.status === "Confirmed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <strong>Status:</strong> {booking.status}
                  </p>

                  {/* Action Buttons */}
                  {booking.status === "Confirmed" &&
                    !isBookingExpired(booking.showDate, booking.showTime) &&
                    booking.seatIds.some(
                      (seat) => seat.status !== "Canceled"
                    ) && (
                      <button
                        onClick={() => openCancelModal(booking)}
                        className="mt-4 py-2 px-4 text-white rounded-lg bg-red-600 hover:bg-red-700"
                      >
                        Cancel Ticket
                      </button>
                    )}
                  {booking.status === "Confirmed" &&
                    isBookingExpired(booking.showDate, booking.showTime) &&
                    booking.seatIds.some(
                      (seat) => seat.status !== "Canceled"
                    ) && (
                      <button
                        onClick={() =>
                          handleRateReviewClick(booking.movieId._id)
                        }
                        className="mt-4 py-2 px-4 text-white rounded-lg bg-red-600 hover:bg-red-700"
                      >
                        Rate movie
                      </button>
                    )}
                </div>

                {/* QR Code */}
                <div className="flex-shrink-0 mt-4 lg:mt-0 lg:ml-4">
                  {booking.qrCode ? (
                    <img
                      src={booking.qrCode}
                      alt="QR Code"
                      className="w-40 h-40 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No QR Code available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Ticket Modal */}
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-semibold mb-4">Cancel Ticket</h3>
              <p>
                Are you sure you want to cancel the ticket for{" "}
                {selectedBooking.movieId.title}?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                The refund amount will be credited to your wallet.
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleCancelBooking(selectedBooking._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg mr-2 hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <RateReviewModal
        isOpen={isRateReviewModalOpen}
        onClose={handleCloseRateReviewModal}
        movieId={movieId}
        userId={user?.user?.id}
      />
    </div>
  );
}

export default BookingHistory;
