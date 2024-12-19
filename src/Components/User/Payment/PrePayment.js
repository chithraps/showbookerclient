import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import axios from "axios";
import swal from "sweetalert";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_BASE_URL);
function PrePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userId,
    theaterId,
    screenId,
    movieId,
    showDate,
    showTime,
    seatIds,
    totalPrice,
  } = location.state;

  const [theaterName, setTheaterName] = useState("");
  const [movieName, setMovieName] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  // Pricing details
  const basePrice = 40;
  const gstRate = 0.18;
  const gst = (basePrice * gstRate).toFixed(2);
  const convenienceFee = parseInt(basePrice) + parseFloat(gst);
  const totalAmount = (
    parseFloat(totalPrice) +
    basePrice +
    parseFloat(gst)
  ).toFixed(2);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
      .split(" ");

    const [dayOfWeek, day, month] = formattedDate;
    const dayWithOrdinal = getOrdinalSuffix(parseInt(day));

    return `${day}${dayWithOrdinal} ${dayOfWeek} ${month}`;
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  useEffect(() => {
    let idleTimeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        swal({
          title: "Session Expired",
          text: "Your session has expired. Click OK to go back to the home page.",
          icon: "warning",
          button: "OK",
        }).then(() => {
          navigate("/"); 
        });
      }, 180000); // 3 minutes timeout
    };

    // Attach event listeners to detect user activity
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    );
    resetIdleTimer(); 
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
      clearTimeout(idleTimeout); 
    };
  }, [navigate]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/fetchDetails`, {
          params: {
            theaterId,
            movieId,
            screenId,
            seatIds,
          },
        });

        const { theater, screen, movie, seats } = response.data;
        setTheaterName(theater);
        setMovieName(movie);
        setScreenNumber(screen);
        setSeats(seats);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching details:", error);
        swal("Error", "Failed to fetch details.", "error");
      }
    };

    fetchDetails();
  }, [
    theaterId,
    movieId,
    screenId,
    seatIds,
    userId,
    showDate,
    showTime,
    navigate,
  ]);

  const handleConvenienceFeeClick = () => {
    setShowPriceDetails((prev) => !prev); // Toggle visibility
  };

  const handleBackClick = () => {
    navigate(`/theatersForMovie/${movieId}`);
  };

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        userId,
        theaterId,
        screenId,
        movieId,
        seatIds,
        totalPrice,
        showDate,
        showTime,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-200 flex justify-center items-center p-6">
      {/* Back button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 flex items-center p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full shadow-md transition duration-200"
      >
        <IoMdArrowBack className="mr-2 text-xl" /> Back
      </button>

      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-lg flex p-4 max-h-[600px]">
        {/* Left column for the image */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={`http://localhost:5000/public/images/prepayment.jpeg`}
            alt="Movie Poster"
            className="rounded-lg shadow-lg object-cover w-96 h-96 transform hover:scale-105 transition duration-300"
          />
        </div>

        {/* Right column for the details */}
        <div className="w-1/2 pl-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading details...</p>
          ) : (
            <div>
              <h2 className="text-xl text-gray-800 mb-4 text-center underline decoration-blue-500">
                BOOKING SUMMARY
              </h2>

              <div className="space-y-3 text-base text-gray-600">
                <p>
                  {theaterName}, Screen {screenNumber}
                </p>
                <p>
                  {movieName}, {formatDate(showDate)}, {showTime}
                </p>

                <p>
                  Amount: <span className="text-green-600">₹{totalPrice}</span>
                </p>
                {/* Convenience Fee and GST */}
                <p
                  onClick={handleConvenienceFeeClick}
                  className="cursor-pointer"
                >
                  Convenience Fee:{" "}
                  <span className="text-green-600">₹{convenienceFee}</span>
                </p>
                {showPriceDetails && (
                  <>
                    <p>
                      Base Price:{" "}
                      <span className="text-green-600">₹{basePrice}</span>
                    </p>
                    <p>
                      GST (18%): <span className="text-green-600">₹{gst}</span>
                    </p>
                  </>
                )}
              </div>
              <hr />
              <div className="mt-5 text-base text-gray-600">
                <p>
                  Total Amount:{" "}
                  <span className="text-green-600">₹{totalAmount}</span>
                </p>
              </div>

              {/* Simplified Seats List */}
              <ul className="list-disc ml-6 space-y-2 text-gray-500 mt-6">
                {seats.map((seat, index) => (
                  <li key={index}>
                    {seat.seating_layout.class_name} - Row: {seat.row_name} -
                    Seat: {seat.seat_number}
                  </li>
                ))}
              </ul>

              {/* Proceed to Payment Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleProceedToPayment}
                  className="px-6 py-2 bg-red-400 text-white text-lg font-semibold rounded-full hover:bg-red-500 shadow-md transition duration-300"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrePayment;
