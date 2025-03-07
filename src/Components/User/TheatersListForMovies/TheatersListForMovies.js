import React, { useEffect, useState } from "react";
import Header from "../LandingPage/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toZonedTime, format } from "date-fns-tz";
import { selectLocation } from "../../../Features/LocationSlice";
import axios from "axios";
import Footer from "../Footer/Footer";

const IST_TIMEZONE = "Asia/Kolkata";

function TheatersListForMovies() {
  const { id } = useParams();
  const selectedLocation = useSelector(selectLocation);
  const [theaters, setTheaters] = useState([]);
  const [movieDetails, setMovieDetails] = useState({
    title: "",
    language: "",
    genre: "",
  });
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const navigate = useNavigate();

  const fetchMovieDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/movieDetails/${id}`);
      setMovieDetails({
        title: response.data.title || "Movie",
        language: response.data.language || "Unknown Language",
        genre: response.data.genre || "Unknown Genre",
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const fetchTheatersForMovie = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/theatersForMovie/${id}`, {
        params: {
          location: selectedLocation,
          selectedDate: selectedDate,
        },
      });
      setTheaters(response.data);
    } catch (error) {
      console.error("Error fetching theaters for movie:", error);
    }
  };

  const generateDates = () => {
    const today = new Date();
    const newDates = [];

    for (let i = 0; i < 4; i++) {
      const utcDate = new Date(today);
      utcDate.setDate(today.getDate() + i);

      // Convert UTC to IST
      const zonedDate = toZonedTime(utcDate, IST_TIMEZONE);

      console.log("zoned date ",zonedDate)

      const isoDate = format(zonedDate, "yyyy-MM-dd", { timeZone: IST_TIMEZONE });
      console.log("isoDate ",isoDate)
      const displayDate = format(zonedDate, "EEE, dd MMM", { timeZone: IST_TIMEZONE }).split(", ");
       console.log("displayDate ",displayDate)

      newDates.push({
        displayDate, 
        isoDate,
      });
    }

    setDates(newDates);
    setSelectedDate(newDates[0].isoDate); 
  };

  useEffect(() => {
    fetchMovieDetails();
    generateDates();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      fetchTheatersForMovie();
    }
  }, [selectedDate, selectedLocation]);

  const handleDateClick = (isoDate) => {
    setSelectedDate(isoDate);
  };

  const handleShowTimingClick = (timing, theaterId, screenId) => {
    console.log("Screen Id ", screenId, " ", theaterId, " ", timing);
    navigate(`/screenLayout`, {
      state: {
        movieId: id,
        theaterId: theaterId,
        screenId: screenId,
        showTiming: timing,
        selectedDate,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow p-4">
        <h1 className="text-4xl mb-6">{`${movieDetails.title} - ${movieDetails.language}`}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="flex space-x-4 mb-6">
          {dates.map((dateObj, index) => {
            const { displayDate, isoDate } = dateObj;
            const isActive = isoDate === selectedDate;
            return (
              <button
                key={index}
                onClick={() => handleDateClick(isoDate)}
                className={`px-4 py-2 rounded-lg text-center ${
                  isActive ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                } hover:bg-red-600`}
              >
                {displayDate.map((part, i) => (
                  <span key={i} className="block">
                    {part}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
        {theaters.length > 0 ? (
          <ul className="flex flex-col gap-6">
            {theaters.map((theater) => (
              <li
                key={theater.id}
                className="p-4 bg-white shadow-md rounded-lg flex flex-col"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">{theater.theater}</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                  <p className="text-gray-600">{theater.location}</p>
                  <p className="text-gray-600">Screen: {theater.screen}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {theater.timings.map((timing, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleShowTimingClick(
                          timing,
                          theater.theaterId,
                          theater.screenId
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      {timing}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">
            No theaters available for this movie in the selected location.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TheatersListForMovies;
