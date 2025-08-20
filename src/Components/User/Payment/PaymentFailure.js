import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import Header from "../LandingPage/Header";
import { useSelector } from "react-redux";

function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  const reason = location.state?.reason || "Payment was not completed.";
  const user = useSelector((state) => state.user);

  const handleViewBookings = () => {
    if (user && user.user.id) {
      navigate("/booking-history");
    } else {
      navigate("/"); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Fixed Header at top */}
      <Header />

      {/* Centered Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 w-full max-w-md text-center overflow-hidden">
          {/* Glowing effect */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
          
          {/* Main content */}
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-red-500/10 rounded-full">
                <XCircle className="h-16 w-16 text-red-400" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3">
              Payment Unsuccessful
            </h1>
            
            <p className="text-gray-300 mb-8">{reason}</p>

            {/* Show Conditional Button */}
            {user && user.user.id ? (
              <button
                onClick={handleViewBookings}
                className="w-full py-3 mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>View Bookings</span>
              </button>
            ) : (
              <p className="text-red-300 font-medium mb-4">
                Please login and retry the payment.
              </p>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Home</span>
            </button>
            
            {/* Help section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-2">Need help?</p>
              <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 text-sm">
                Contact our support team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;