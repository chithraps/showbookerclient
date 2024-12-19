import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import {logoutUser} from "../../../Features/UserActions";

const WalletModal = ({ isOpen, onClose, userId }) => {
  const [walletAmount, setWalletAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const token = user.accessToken;
  useEffect(() => {
    if (isOpen && userId) {
      console.log("userID : ", userId);
      const fetchWalletBalance = async () => {
        try {
          const baseUrl = process.env.REACT_APP_BASE_URL;
          const response = await axios.get(`${baseUrl}/wallet/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setWalletAmount(response.data.balance);
        } catch (error) {
          setError(error.response.data.message);
          if(error.response.data.message==="Unauthorized: Token has expired"){
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
          }
        } finally {
          setLoading(false);
        }
      };

      fetchWalletBalance();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96 transform transition-transform duration-300 ease-out scale-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Wallet Balance
        </h2>

        {loading ? (
          <p className="text-lg text-center">Loading...</p>
        ) : error ? (
          <p className="text-lg text-center text-red-600">{error}</p>
        ) : (
          <p className="text-lg font-medium text-gray-700 text-center">
            Current Balance:{" "}
            <span
              className={`font-bold ${
                walletAmount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{walletAmount > 0 ? walletAmount : 0}
            </span>
          </p>
        )}

        <button
          className="mt-6 w-full bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all duration-200 ease-in-out"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
