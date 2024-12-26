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
import swal from "sweetalert";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    width: "90%", // Default width for smaller devices
    maxWidth: "600px", // Limit maximum width
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker overlay for better focus
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
        navigate("/home");
      } catch (error) {
        console.log("Error in signIn : ", error);
        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.message === "User is blocked. Access denied."
        ) {
          swal({
            title: "Access Denied",
            text: "Your account is blocked. Please contact support.",
            icon: "error",
          });
        }
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
      ariaHideApp={false} // To prevent the app from being hidden from screen readers
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-center flex-grow">Sign in</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <IoMdClose size={24} />
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className="bg-red-100 text-slate-950 px-4 py-2 rounded-md hover:bg-red-200 w-full max-w-xs h-12 flex items-center justify-center"
          onClick={() => login()}
        >
          <FcGoogle className="mr-2" size={20} /> Sign in with Google
        </button>
      </div>
      <h4 className="flex justify-center mb-4">OR</h4>
      <div className="flex justify-center mb-4">
        <button
          className="bg-red-100 text-slate-950 px-4 py-2 rounded-md hover:bg-red-200 w-full max-w-xs h-12 flex items-center justify-center"
          onClick={openEmailModal}
        >
          <MdOutlineMail className="mr-2" size={20} /> Sign in with Email
        </button>
      </div>
      <SignInWithEmail isOpen={isEmailModalOpen} onClose={closeEmailModal} />
    </Modal>
  );
}

export default Register;
