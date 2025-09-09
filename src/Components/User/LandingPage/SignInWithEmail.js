import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../Features/UserActions";
import Swal from "sweetalert";
import { apiRequest } from "../../Utils/api";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    width: "600px",
    height: "290px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
};

function SignInWithEmail({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContinue = async () => {
    const response = await apiRequest("POST", "/signIn", {
      type: "email",
      email,
    });

    if (response.success) {
      setOtpModalOpen(true);
    } else {
      console.error("Error sending OTP:", response.message);
    }
  };

  const handleOtpSubmit = async () => {
    const response = await apiRequest("POST", "/verify-otp", { email, otp });

    if (response.success) {
      console.log("OTP verified, user signed in:", response.data);
      const { token, user } = response.data;

      setOtpModalOpen(false);
      onClose();

      console.log(user, token, " user and token");
      dispatch(loginUser(user, token));
      navigate("/home");
    } else {
      if (response.message === "Invalid or expired OTP") {
        setIsOtpExpired(true);
        console.log("OTP expired. Setting isOtpExpired to true.");
        Swal(response.message);
      } else if (
        response.status === 403 &&
        response.message === "User is blocked. Access denied."
      ) {
        Swal({
          title: "Access Denied",
          text: "Your account is blocked. Please contact support.",
          icon: "error",
        });
      } else {
        Swal(response.message || "Failed to verify OTP. Please try again.");
      }
    }
  };

  const handleResendOtp = async () => {
    console.log("In handleResendOtp, email:", email);

    const response = await apiRequest("POST", "/resend-otp", { email });

    if (response.success) {
      Swal("OTP resent successfully.");
      setIsOtpExpired(false); 
      setOtp(""); 
      console.log("Resent OTP. Setting isOtpExpired to false.");
    } else {
      console.error("Error resending OTP:", response.message);
      Swal(response.message || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-center flex-grow">
            Sign in with Email
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="flex justify-center mb-5">
          <input
            type="text"
            placeholder="Enter your email"
            className="border border-gray-300 px-4 py-2 rounded-md ml-4 focus:outline-none w-60 focus:ring focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-center mb-5">
          <button
            onClick={handleContinue}
            className="bg-red-200 text-white px-4 py-2 rounded-md hover:bg-red-300"
          >
            Continue
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={otpModalOpen}
        onRequestClose={() => setOtpModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-center flex-grow">
            Enter OTP
          </h2>
          <button
            onClick={() => setOtpModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="flex justify-center mb-5">
          <input
            type="text"
            placeholder="Enter your OTP"
            className="border border-gray-300 px-4 py-2 rounded-md ml-4 focus:outline-none w-60 focus:ring focus:border-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <div className="flex justify-center mb-5">
          <button
            onClick={handleOtpSubmit}
            className="bg-red-200 text-white px-4 py-2 rounded-md hover:bg-red-300"
          >
            Submit OTP
          </button>
        </div>
        {isOtpExpired && (
          <div className="flex justify-center mb-5">
            <button
              onClick={handleResendOtp}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Resend OTP
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

export default SignInWithEmail;
