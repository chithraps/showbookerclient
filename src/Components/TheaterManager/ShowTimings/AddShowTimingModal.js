import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import sweet from "sweetalert";

const AddShowTimingModal = ({ isOpen, onClose, onSave }) => {
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedTimings, setSelectedTimings] = useState([]);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const theater_id = theaterAdmin.theaterAdmin.theaterId;
  const token = theaterAdmin.theaterAdminAccessToken;

  const timeSlots = [
    "10:30 AM",
    "11:00 AM",
    "2:30 PM",
    "3:00 PM",
    "6:00 PM",
    "6:30 PM",
    "9:00 PM",
    "9:30 PM",
  ];

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/fetchScreens`, {
          params: { theaterId: theater_id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setScreens(response.data);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, [theater_id]);

  const handleLanguageChange = async (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    setSelectedMovie(""); // Reset selected movie when language changes
    if (language) {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/viewMovies`, {
          params: { language },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    } else {
      setMovies([]);
    }
  };

  const handleTimingChange = (e) => {
    const timing = e.target.value;
    if (e.target.checked) {
      if (selectedTimings.length < 4 && validateTiming(timing)) {
        setSelectedTimings([...selectedTimings, timing]);
      } else {
        e.target.checked = false; // Uncheck the checkbox if it exceeds the limit or validation fails
      }
    } else {
      setSelectedTimings(selectedTimings.filter((t) => t !== timing));
    }
  };

  const validateTiming = (newTiming) => {
    const newTime = parseTime(newTiming);
    return selectedTimings.every(
      (timing) => Math.abs(newTime - parseTime(timing)) >= 180
    );
  };

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

  const handleSave = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/tmAdmin/addShowTiming`,
        {
          theater_id,
          screen_id: selectedScreen,
          movie_id: selectedMovie,
          timings: selectedTimings,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSave();
      resetForm();
      sweet("Success", response.data.message, "success");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Error adding show timing";
      sweet("Error", errorMessage, "error");
      console.error("Error adding show timing:", error);
    }
  };

  const resetForm = () => {
    setSelectedScreen("");
    setSelectedLanguage("");
    setSelectedMovie("");
    setSelectedTimings([]);
    setMovies([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add Show Timing</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Screen:</label>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Screen</option>
            {screens.map((screen) => (
              <option key={screen._id} value={screen._id}>
                {screen.screen_number}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Language:</label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Language</option>
            <option value="Malayalam">Malayalam</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>

            {/* Add other languages as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Movie:</label>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!selectedLanguage} // Disable dropdown until language is selected
          >
            <option value="">Select Movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Timings (select up to 4):
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <div key={time}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={time}
                    checked={selectedTimings.includes(time)}
                    onChange={handleTimingChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{time}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  ) : null;
};

export default AddShowTimingModal;
