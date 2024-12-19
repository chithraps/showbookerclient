import React, { useState, useEffect } from "react";
import axios from "axios";
import sweet from "sweetalert";
import { useSelector } from "react-redux";

function EditShowTimingsModal({ isOpen, onClose, onSave, timing }) {
  const [theaterName, setTheaterName] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [timings, setTimings] = useState([]);
  const [availableTimings, setAvailableTimings] = useState([
    "10:30 AM",
    "11:00 AM",
    "2:30 PM",
    "3:00 PM",
    "6:00 PM",
    "6:30 PM",
    "9:00 PM",
    "9:30 PM",
  ]);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;

  useEffect(() => {
    if (timing) {
      setTheaterName(timing.theater_id.name);
      setScreenNumber(timing.screen_id.screen_number);
      setMovieTitle(timing.movie_id.title);
      setTimings(timing.timings);

      // Ensure all existing timings are included in availableTimings
      const allTimings = Array.from(
        new Set([...availableTimings, ...timing.timings])
      );
      setAvailableTimings(allTimings);
    }
  }, [timing]);

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const validateTiming = (newTiming) => {
    const newTime = parseTime(newTiming);
    return timings.every(
      (timing) => Math.abs(newTime - parseTime(timing)) >= 180
    );
  };

  const handleTimingChange = (e) => {
    const value = e.target.value;
    setTimings((prevTimings) => {
      if (prevTimings.includes(value)) {
        return prevTimings.filter((timing) => timing !== value);
      } else {
        if (validateTiming(value)) {
          return [...prevTimings, value];
        } else {
          return prevTimings;
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.patch(
        `${baseUrl}/tmAdmin/updateShowTiming/${timing._id}`,
        {
          theater_id: timing.theater_id._id,
          screen_id: timing.screen_id._id,
          movie_id: timing.movie_id._id,
          timings,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      sweet("Success", response.data.message, "success");
      onSave();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Error updating show timing";
      sweet("Error", errorMessage, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg relative z-10">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 px-3 py-1 rounded"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl mb-4">Edit Show Timing</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Theater Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={theaterName}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Screen Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={screenNumber}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Movie Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={movieTitle}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Timings</label>
            <div className="grid grid-cols-2 gap-2">
              {availableTimings.map((time) => (
                <div key={time} className="flex items-center">
                  <input
                    type="checkbox"
                    value={time}
                    checked={timings.includes(time)}
                    onChange={handleTimingChange}
                    className="mr-2"
                  />
                  <label>{time}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditShowTimingsModal;
