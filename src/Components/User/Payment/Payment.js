import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import swal from "sweetalert";
import axios from "axios";
import io from "socket.io-client";
const socket = io(process.env.REACT_APP_BASE_URL);

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = user.accessToken;

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
  const id = movieId;

  const [theaterName, setTheaterName] = useState("");
  const [movieName, setMovieName] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [email, setEmail] = useState(user?.user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(false);
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
      }
    };
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/wallet/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWalletBalance(response.data.balance);
        console.log("balance ", response.data.balance);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchDetails();
    if (user && user.user !== null) {
      fetchWalletBalance();
    }
  }, [theaterId, movieId, screenId, seatIds]);
  useEffect(() => {
    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailPattern.test(email));
    }
  }, [email]);
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
      }, 120000);
    };

    // Attach event listeners to detect user activity
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
      clearTimeout(idleTimeout);
    };
  }, [navigate]);

  const handleConvenienceFeeClick = () => {
    setShowPriceDetails((prev) => !prev);
  };

  const handleBackClick = () => {
    navigate(`/theatersForMovie/${id}`);
  };
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(inputEmail));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const handlePaymentClick = async () => {
    if (paymentMethod === "wallet") {
      console.log(
        "wallet amount ",
        walletBalance >= totalAmount,
        " ",
        typeof walletBalance,
        " ",
        typeof totalAmount
      );
      if (walletBalance > 0) {
        const remainingAmount =
          totalAmount - walletBalance > 0 ? totalAmount - walletBalance : 0;
        console.log("remainingAmount ", remainingAmount);

        if (walletBalance >= totalAmount) {
          try {
            console.log("TOTAL AMOUNT ", totalAmount);
            const response = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/deductWalletBalance`,
              {
                userId,
                amount: totalAmount,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const { transactionId } = response.data;

            const bookingData = {
              userId,
              userEmail: email,
              movieId,
              theaterId,
              screenId,
              showDate,
              showTime,
              seatIds,
              totalAmount,
              payment: {
                status: "Completed",
                transactionId,
                method: "wallet",
              },
            };
            const res = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/bookTicket`,
              bookingData
            );
            const bookingInfo = res.data.booking;
            console.log("booking ", bookingInfo.bookingId);
            swal("Success", "Payment successful from Wallet!");

            navigate("/bookingConfirmation", {
              state: {
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
              },
            });
          } catch (error) {
            console.error("Error processing wallet payment:", error);
            swal("Failed", "Wallet payment failed!");
          }
        } else {
          swal(
            "Insufficient Balance",
            "Your wallet amount is not sufficient, so we are including Razorpay for the rest of the payment."
          ).then((value) => {
            if (value) {
              axios
                .post(
                  `${process.env.REACT_APP_BASE_URL}/deductWalletBalance`,
                  {
                    userId,
                    amount: walletBalance,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then(() => {
                  handleRazorpayPayment(remainingAmount);
                })
                .catch((error) => {
                  console.error("Error deducting wallet balance:", error);
                  swal(
                    "Failed",
                    "There was an issue with the wallet deduction."
                  );
                });
            }
          });
        }
      } else {
        swal(
          "Insufficient Balance",
          "Your wallet balance is not sufficient to complete the payment."
        );
      }
    } else if (paymentMethod === "razorpay") {
      handleRazorpayPayment(totalAmount);
    }
  };
  const handleRazorpayPayment = async (amount) => {
    console.log(" razor pay key id ", process.env.RAZORPAY_KEY_ID);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/placeOrder`,
        {
          amount,
          currency: "INR",
        }
      );
      const order = response.data;
      console.log("order ", order);
      const options = {
        key: "rzp_test_00UfVda9AoMmII",
        amount: order.amount,
        currency: order.currency,
        name: "Movie Booking",
        description: `Payment for Movie: ${movieName}`,
        image: "",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${process.env.REACT_APP_BASE_URL}/confirmPayment`,
              {
                orderId: order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            // save booking to the database.
            const bookingData = {
              userId,
              userEmail: email,
              movieId,
              theaterId,
              screenId,
              showDate,
              showTime,
              seatIds,
              totalAmount,
              payment: {
                status: "Completed",
                transactionId: response.razorpay_payment_id,
                method: "razorpay",
              },
            };
            const res = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/bookTicket`,
              bookingData
            );
            const bookingInfo = res.data.booking;
            console.log("bookingInfo ", bookingInfo.bookingId);
            swal(" Success", "Payment successful!");
            navigate("/bookingConfirmation", {
              state: {
                theaterName,
                movieName,
                screenNumber,
                seats,
                showDate,
                showTime,
                totalPrice,
                totalAmount,
                transactionId: response.razorpay_payment_id,
                bookingInfo,
              },
            });
          } catch (error) {
            console.error("Error confirming payment:", error);
            swal("Failed", "Payment failed!");
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: async function () {
            navigate("/paymentFailure", {
              state: { reason: "Payment window closed" },
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  

  return (
    <div className="h-screen mt-5">
      {/* Header */}
      <header className="bg-gray-600 text-white p-4 text-center">
        <h1 className="text-xl font-bold">Payment</h1>
      </header>

      {/* Main Content */}
      <div className="flex gap-4 p-4 h-full">
        {/* Payment Gateway - 3/4 width */}
        <div className="w-3/4 h-4/5 shadow-2xl p-4 rounded-lg">
          {/* Email Input for ticket details */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email (for sending ticket details):
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
            {!isEmailValid && email && (
              <p className="text-red-500 text-sm">
                Please enter a valid email.
              </p>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Select Payment Method:
            </label>
            <div className="mt-2">
              {user && user.user !== null && (
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="wallet"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={handlePaymentMethodChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="wallet"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Wallet
                  </label>
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="razorpay"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={handlePaymentMethodChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="razorpay"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Razorpay
                </label>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="mt-6">
            <button
              onClick={handlePaymentClick}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-600"
              disabled={!email || !paymentMethod}
            >
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* Order Summary - 1/4 width */}
        <div className="w-1/4 h-3/5 p-4 shadow-2xl rounded-lg">
          <h2 className="font-bold text-gray-600 mb-7">Order Summary</h2>
          <div className="space-y-3 text-base text-gray-600">
            <p>
              {theaterName}, Screen {screenNumber}
            </p>
            <p>
              {movieName}, {formatDate(showDate)}, {showTime}
            </p>

            {/* Simplified Seats List */}
            <ul className="list-disc ml-6 space-y-2 text-gray-500 mt-6">
              {seats.map((seat, index) => (
                <li key={index}>
                  {seat.seating_layout.class_name} - Row: {seat.row_name} -
                  Seat: {seat.seat_number}
                </li>
              ))}
            </ul>
            <p>
              Amount: <span className="text-green-600">₹{totalPrice}</span>
            </p>

            {/* Convenience Fee and GST */}
            <p onClick={handleConvenienceFeeClick} className="cursor-pointer">
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
              Total Amount :{" "}
              <span className="text-green-600">₹{totalAmount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
