import React, { useState } from "react";
import axios from 'axios';
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../Features/UserActions";

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
    width: "600px", // Adjust the width as needed
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
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleContinue = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL; 
      const response = await axios.post(`${baseUrl}/signIn`, {
        type: "email",
        email,
      });

      if (response.status === 200) {
        setOtpModalOpen(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL; 
      const response = await axios.post(`${baseUrl}/verify-otp`, {
        email,
        otp,
      });

      if (response.status === 200) {
        console.log("OTP verified, user signed in:", response.data);
        // Handle successful sign-in, e.g., save token, redirect user, etc.
        const { token, user } = response.data;
        setOtpModalOpen(false);
        onClose(); // Close the main modal
        
        console.log(user, token);
        dispatch(loginUser(user, token));
        navigate('/home')

      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to verify OTP. Please try again.");
      }
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
          <button onClick={() => setOtpModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
        {errorMessage && (
          <div className="text-red-500 text-center mb-5">{errorMessage}</div>
        )}
      </Modal>
    </>
  );
}

export default SignInWithEmail;
