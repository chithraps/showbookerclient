import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import StepperForm from "../Stepper/StepperForm";
import ScreenDetailsModal from "./ScreenDetailsModal";
import swal from "sweetalert";
import { logoutTM } from '../../../Features/TheaterAdminActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

function ScreenCard() {
  const [screens, setScreens] = useState([]);
  const [showStepperForm, setShowStepperForm] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [screenDetails, setScreenDetails] = useState(null);
  const [seatingLayoutDetails, setSeatingLayoutDetails] = useState(null);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const theaterId = theaterAdmin.theaterAdmin.theaterId;
  const token = theaterAdmin.theaterAdminAccessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const fetchScreens = async () => {
    try {     
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/tmAdmin/fetchScreens`, {
        params: { theaterId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScreens(response.data); 
     
    } catch (error) {
      setScreens([])
      console.error("Error fetching screens:", error.response.data.message);
     
      if(error.response.data.message === "Unauthorized: Token has expired"){
        dispatch(logoutTM());
        navigate("/theaterAdmin")
      }
    }
  };

  const fetchScreenDetails = async (screenId) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/tmAdmin/fetchScreenDetails`,
        {
          params: { screenId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );

      const { screenDetails } = response.data;

      setScreenDetails(screenDetails);
    } catch (error) {
      console.error("Error fetching screen details:", error);
    }
  };
  const deleteScreen = async (screenId) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.delete(`${baseUrl}/tmAdmin/deleteScreen`, {
        params: { screenId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      swal("Success", response.data.message, "success");
      await fetchScreens();
    } catch (error) {
      console.error("Error deleting screen:", error);
    }
  };

  useEffect(() => {
    console.log(" in useEffect")
    fetchScreens();
  }, [theaterId]);

  const handleRowClick = (screen) => {
    setSelectedScreen(screen);
    fetchScreenDetails(screen._id);
  };

  return (
    <div className="flex-grow p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Screens</h1>
        <button
          onClick={() => setShowStepperForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Screen
        </button>
      </div>

      {screens.length === 0 ? (
        <p>No screens added.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Screen Number</th>
                <th className="py-2 px-4 border-b text-left">
                  Seating Capacity
                </th>
                <th className="py-2 px-4 border-b text-left">Sound System</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {screens.map((screen) => (
                <tr key={screen._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{screen.screen_number}</td>
                  <td className="py-2 px-4 border-b">{screen.capacity}</td>
                  <td className="py-2 px-4 border-b">{screen.sound_system}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded mr-1"
                      onClick={() => handleRowClick(screen)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-red-500 ml-10 text-white py-1 px-2 rounded"
                      onClick={() => deleteScreen(screen._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ScreenDetailsModal
        isOpen={selectedScreen && screenDetails}
        onClose={() => setSelectedScreen(null)}
        screenDetails={screenDetails}
        selectedScreen={selectedScreen}
      />

      {showStepperForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowStepperForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <StepperForm onScreenAdded={fetchScreens} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ScreenCard;
