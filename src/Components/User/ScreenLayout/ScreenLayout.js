import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoMdArrowBack } from "react-icons/io";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import swal from "sweetalert";

const socket = io(process.env.REACT_APP_BASE_URL);

function ScreenLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, theaterId, screenId, showTiming, selectedDate } =
    location.state;
  const user = useSelector((state) => state.user);
  const [userId, setUserId] = useState(null);
  const [screenDetails, setScreenDetails] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState(new Set());
  const [heldSeatIds, setHeldSeatIds] = useState(new Set());
  const [seatPriceMap, setSeatPriceMap] = useState(new Map());
  const maxSeatsAllowed = 10;

  useEffect(() => {
    if (user && user.user && user.user.id) {
      setUserId(user.user.id);
    } else {
      let guestId = localStorage.getItem("guestUserId");
      let guestIdTimestamp = localStorage.getItem("guestUserIdTimestamp");
      const currentTime = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours

      if (
        !guestId ||
        !guestIdTimestamp ||
        currentTime - guestIdTimestamp > expirationTime
      ) {
        guestId = uuidv4();
        localStorage.setItem("guestUserId", guestId);
        localStorage.setItem("guestUserIdTimestamp", currentTime);
      }
      setUserId(guestId);
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (!userId) return;

    const fetchScreenDetails = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/showScreenLayout/${screenId}`,
          {
            params: {
              showDate: selectedDate,
              showTime: showTiming,
            },
          }
        );
        setScreenDetails(response.data.screenDetails);
        
        setBookedSeatIds(new Set(response.data.bookedSeatIds));
        console.log("Booked seats ", response.data.bookedSeatIds);
        const map = new Map();
        response.data.screenDetails.seating_layout_ids.forEach((layout) => {
          layout.row_ids.forEach((row) => {
            row.seat_ids.forEach((seat) => {
              map.set(seat._id.toString(), layout.price);
            });
          });
        });
        setSeatPriceMap(map);

        let userHeldSeats = [];
        if (
          response.data.screenDetails.heldSeatIds &&
          response.data.screenDetails.heldSeatIds[userId]
        ) {
          userHeldSeats = response.data.screenDetails.heldSeatIds[userId];
        }

        if (userHeldSeats.length > 0) {
          setSelectedSeats(userHeldSeats);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching screen details:", error);
        setLoading(false);
        swal("Error", "Failed to fetch screen details.", "error");
      }
    };

    const fetchMovieDetails = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/movieDetails/${movieId}`);
        setMovieDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
        swal("Error", "Failed to fetch movie details.", "error");
      }
    };

    fetchScreenDetails();
    fetchMovieDetails();

    socket.emit("joinRoom", {
      screenId,
      showDate: selectedDate,
      showTime: showTiming,
    });

    const handleSeatsHeld = ({ seatIds, userId: holderId }) => {
      if (holderId !== userId) {
        setHeldSeatIds((prev) => {
          const updated = new Set(prev);
          seatIds.forEach((id) => updated.add(id));
          return updated;
        });
      }
    };

    const handleSeatsReleased = ({ seatIds }) => {
      if (!seatIds || !Array.isArray(seatIds)) {
        console.error("Seat IDs are missing or invalid in seatsReleased event");
        return;
      }

      setHeldSeatIds((prev) => {
        const updated = new Set(prev);
        seatIds.forEach((id) => updated.delete(id));
        return updated;
      });
    };
    socket.emit("getHeldSeats", {
      screenId,
      showDate: selectedDate,
      showTime: showTiming,
    });

    const handleHoldSeatsFailed = ({ message, unavailableSeats }) => {
      swal("Hold Seats Failed", message, "error");
      if (unavailableSeats && unavailableSeats.length > 0) {
        setBookedSeatIds((prev) => {
          const updated = new Set(prev);
          unavailableSeats.forEach((id) => updated.add(id));
          return updated;
        });
      }
    };

    const handleHoldSeatsResponse = (response) => {
      if (response.success) {
        // Proceed to payment
      } else {
        swal("Hold Seats Failed", response.message, "error");
        if (response.unavailableSeats && response.unavailableSeats.length > 0) {
          setBookedSeatIds((prev) => {
            const updated = new Set(prev);
            response.unavailableSeats.forEach((id) => updated.add(id));
            return updated;
          });
        }
      }
    };

    socket.on("seatsHeld", handleSeatsHeld);
    socket.on("heldSeatsData", ({ heldSeats }) => {
      setHeldSeatIds(new Set(heldSeats));
    });
    socket.on("seatsReleased", handleSeatsReleased);
    socket.on("holdSeatsFailed", handleHoldSeatsFailed);
    socket.on("holdSeatsResponse", handleHoldSeatsResponse);

    return () => {
      socket.off("seatsHeld", handleSeatsHeld);
      socket.off("seatsReleased", handleSeatsReleased);
      socket.off("holdSeatsFailed", handleHoldSeatsFailed);
      socket.off("heldSeatsData");
      socket.off("holdSeatsResponse", handleHoldSeatsResponse);
      socket.emit("leaveRoom", {
        screenId,
        showDate: selectedDate,
        showTime: showTiming,
      });
    };
  }, [screenId, movieId, selectedDate, showTiming, navigate, userId, user]);

  const handleSeatClick = (seatId) => {
    if (
      bookedSeatIds.has(seatId.toString()) ||
      heldSeatIds.has(seatId.toString())
    ) {
      return; // Prevent selecting booked or held seats
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter((id) => id !== seatId)
      );
      socket.emit("releaseSeat", {
        userId,
        screenId,
        showDate: selectedDate,
        showTime: showTiming,
        seatId,
      });
    } else if (selectedSeats.length < maxSeatsAllowed) {
      setSelectedSeats([...selectedSeats, seatId]);
    } else {
      swal(
        "Limit Reached",
        `You can select up to ${maxSeatsAllowed} seats only.`,
        "warning"
      );
    }
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedSeats.forEach((seatId) => {
      const price = seatPriceMap.get(seatId.toString()) || 0;
      total += price;
    });
    return total;
  }, [selectedSeats, seatPriceMap]);

  const handlePay = () => {
    if (selectedSeats.length === 0) {
      swal(
        "No Seats Selected",
        "Please select at least one seat to proceed with payment.",
        "info"
      );
      return;
    }

    socket.emit("holdSeats", {
      userId,
      screenId,
      showDate: selectedDate,
      showTime: showTiming,
      seatIds: selectedSeats,
    });

    socket.once("holdSeatsResponse", (response) => {
      console.log("in holdSeatsResponse ");
      if (response.success) {
        navigate("/prepayment", {
          state: {
            userId,
            theaterId,
            screenId,
            movieId,
            showDate: selectedDate,
            showTime: showTiming,
            seatIds: selectedSeats,
            totalPrice,
          },
        });
      } else {
        swal("Hold Seats Failed", response.message, "error");
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"></div>;
  }

  if (!screenDetails || !movieDetails) {
    return <div className="text-center py-5"></div>;
  }

  return (
    <div className="relative pb-24">
      {" "}
      {/* Added relative positioning and bottom padding to accommodate fixed footer */}
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header with Back Button and Movie Title */}
        <div className="flex justify-normal space-x-3 mb-4">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mb-4 hover:bg-gray-300"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowBack />
          </button>

          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {movieDetails.title}
          </h3>
        </div>

        {/* Show Details */}
        <p className="text-base text-gray-600 mb-6">
          {screenDetails.theater_id.name}, Screen {screenDetails.screen_number},{" "}
          {formatDate(selectedDate)}, {showTiming}
        </p>

        {/* Seating Layout */}
        {screenDetails.seating_layout_ids.map((layout) => (
          <div
            key={layout._id}
            className="bg-gray-50 rounded-lg p-4 mb-6 shadow-md"
          >
            {/* Layout Header */}
            <div className="flex justify-normal items-center mb-6">
              <h5 className="text-base font-normal text-gray-700">
                {layout.class_name}
              </h5>
              <p className="text-gray-500 flex items-center ml-4">
                <LiaRupeeSignSolid /> {layout.price}
              </p>
            </div>

            {/* Rows and Seats */}
            {layout.row_ids.map((row, rowIndex) => (
              <div
                key={row._id}
                className="flex items-center flex-wrap mb-4"
                style={{
                  marginBottom: 
                    row.space > 0 && rowIndex !== layout.row_ids.length - 1
                      ? `${row.space * 29}px`
                      : window.innerWidth < 768
                      ? "12px" 
                      : "18px", 
                }}
              >
                <h5 className="font-medium text-gray-500 w-16 mr-4 sm:w-20 md:w-24 lg:w-32">
      {row.row_name}
    </h5>
                <div className="flex flex-wrap gap-2">
                  {row.seat_ids.map((seat) => (
                    <React.Fragment key={seat._id}>
                      {/* Handle spacing before the seat */}
                      {seat.spacing > 0 &&
                        seat.spacingPosition === "before" && (
                          <div
                            className="inline-block"
                            style={{ width: `${seat.spacing * 29}px` }}
                          ></div>
                        )}

                      {/* Seat */}
                      <span
                        role="button"
                        aria-label={`Seat ${seat.seat_number} - ${
                          layout.class_name
                        } ${
                          bookedSeatIds.has(seat._id.toString())
                            ? "Booked"
                            : heldSeatIds.has(seat._id.toString())
                            ? "Held"
                            : selectedSeats.includes(seat._id)
                            ? "Selected"
                            : "Available"
                        }`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleSeatClick(seat._id);
                          }
                        }}
                        className={`inline-block w-6 h-6 text-center rounded border-2 cursor-pointer transition-colors duration-200 ${
                          bookedSeatIds.has(seat._id.toString())
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : heldSeatIds.has(seat._id.toString())
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : selectedSeats.includes(seat._id)
                            ? "bg-green-300 text-white "
                            : "border-green-500 text-black bg-white hover:bg-green-100"
                        }`}
                        key={seat._id}
                        onClick={() => handleSeatClick(seat._id)}
                      >
                        {seat.seat_number}
                      </span>

                      {/* Handle spacing after the seat */}
                      {seat.spacing > 0 && seat.spacingPosition === "after" && (
                        <div
                          className="inline-block"
                          style={{ width: `${seat.spacing * 29}px` }}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Screen Direction Indicator */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mt-2 mb-3">Screen in this Direction</p>
          <svg
            width="60%"
            height="4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <rect x="0" y="0" width="100%" height="4" fill="#000" />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 mr-2">
          <span className="inline-block w-6 h-6 text-center rounded border-2 border-green-500 text-black bg-white mr-2"></span>
          <p className="mr-7">Available</p>
          <span className="inline-block w-6 h-6 text-center rounded border-2 bg-gray-400 ml-2"></span>
          <p className="mr-7">Sold</p>
          <span className="inline-block w-6 h-6 text-center rounded border-2 bg-green-500 ml-2"></span>
          <p className="mr-7">Selected</p>
        </div>
      </div>
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-center items-center">
          <button
            className="flex items-center bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={handlePay}
          >
            Pay <LiaRupeeSignSolid className="ml-2" /> {totalPrice}
          </button>
        </div>
      )}
    </div>
  );
}

export default ScreenLayout;
