import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { logoutUser } from "../../../Features/UserActions";

const WalletModal = ({ isOpen,  onClose, userId }) => {
  const [walletAmount, setWalletAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user.accessToken;
  useEffect(() => {
    if (!isOpen) {
      setShowTransactions(false); 
      setTransactions([]); 
    }
  }, [isOpen]);
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
          if (
            error.response.data.message === "Unauthorized: Token has expired"
          ) {
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

      fetchWalletBalance();
    }
  }, [isOpen, userId]);
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      console.log("in fetch Transactions ");
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/getWalletTransactions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data.transactions);
      setShowTransactions(true);
    } catch (error) {
      swal("Error", "Failed to fetch transactions.", "error");
    } finally {
      setLoadingTransactions(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96 transform transition-transform duration-300 ease-out scale-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-lg font-bold"
        >
          ×
        </button>
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
        {/* Transaction List */}
        <button
          onClick={fetchTransactions}
          className="mt-4 w-full bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 ease-in-out"
          disabled={loadingTransactions}
        >
          {loadingTransactions ? "Loading..." : "See Transactions"}
        </button>

        {/* Transaction List */}
        {showTransactions && (
          <div className="mt-4 max-h-48 overflow-y-auto border-t pt-3">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
              Latest Transactions
            </h3>
            {transactions.length === 0 ? (
              <p className="text-center text-gray-600">
                No transactions found.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {transactions.map((txn, index) => (
                  <li key={index} className="py-2 px-2 flex justify-between">
                    <span className="text-sm text-gray-700">
                      {txn.type === "Credit" ? "\u2B06" : "\u2B07" } ₹{txn.amount}
                    </span>
                    <p className="text-xs text-gray-500">
                      {new Date(txn.timestamp).toLocaleString()}{" "}
                      {/* Formatting Date */}
                    </p>
                    <span
                      className={`text-sm font-medium ${
                        txn.type === "Credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
