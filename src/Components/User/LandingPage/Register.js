import React, { useState } from "react";
import Modal from "react-modal";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../Features/UserActions";
import { IoMdClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMail } from "react-icons/md";
import SignInWithEmail from "./SignInWithEmail";
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
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
};

function Register({ isOpen, onClose }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const handleInputChange = (e) => {
    setMobileNumber(e.target.value);
  };
  const handleContinue = () => {
    console.log("continue invoked");
  };
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL; 
        const response = await axios.post(`${baseUrl}/signIn`, {
          type: "google",
          googleAccessToken: tokenResponse.access_token,
        });
        
        const { token, user } = response.data;
        console.log(user, token);
        dispatch(loginUser(user, token));
        navigate('/home')
      } catch (error) {
        console.log("Error in signIn : ", error);
      }
    },
  });
  const openEmailModal = () => {
    setIsEmailModalOpen(true);
  };
  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false} // to prevent the app from being hidden from screen readers
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-center flex-grow">Sign in</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <IoMdClose />
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className="bg-red-100 text-slate-950 px-4 py-2 rounded-md hover:bg-red-200 w-60 h-12 flex items-center"
          onClick={() => login()}
        >
          <FcGoogle className="mr-2" /> Sign in with Google
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className="bg-red-100 text-slate-950 px-4 py-2 rounded-md hover:bg-red-200 w-60 h-10 flex items-center"
          onClick={openEmailModal}
        >
          <MdOutlineMail className="mr-2" /> Sign in with Email
        </button>
      </div>
      <h4 className="flex justify-center mb-4">OR</h4>
      <div className="flex justify-center mb-4">
        <input
          type="number"
          placeholder="Enter your Mobile number"
          className="border border-gray-300 px-4 py-2 rounded-md ml-4 focus:outline-none w-60 focus:ring focus:border-blue-500"
          style={{ margin: "0", padding: "0" }}
          value={mobileNumber}
          onChange={handleInputChange}
        />
      </div>
      {mobileNumber && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleContinue}
            className="bg-red-200 text-white px-4 py-2 rounded-md hover:bg-red-300"
          >
            Continue
          </button>
        </div>
      )}
      <SignInWithEmail isOpen={isEmailModalOpen} onClose={closeEmailModal} />
    </Modal>
  );
}

export default Register;
