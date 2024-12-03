import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../LandingPage/Header";
import Register from "../LandingPage/Register";

function MovieDetails() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: "",
    poster: "",
    release_date: "",
    duration: 0,
    language: "",
    genre_id: { name: "" },
    description: "",
    cast: [],
    crew: [],
    trailer_url: "",
  });
  const [ratingInfo, setRatingInfo] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/movieDetails/${id}`);
        setMovie(response.data || movie);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchMovieRating = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/movieRating/${id}`);
        setRatingInfo(response.data);
      } catch (error) {
        console.error("Error fetching movie rating:", error);
      }
    };

    fetchMovieDetails();
    fetchMovieRating();
  }, [id]);

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleBookNow = () => {
    navigate(`/theatersForMovie/${id}`);
  };

  const displayStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-2xl ${i <= rating ? "text-yellow-500" : "text-gray-300"}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow px-4 py-6 md:p-8">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-start sm:gap-8">
            <img
              className="w-full sm:w-72 max-w-full h-auto rounded-md"
              src={`${movie.posterUrl}`}
              alt={movie.title}
            />
            <div className="mt-4 sm:mt-0">
              <h1 className="text-2xl md:text-3xl font-bold text-center sm:text-left">
                {movie.title || "N/A"}
              </h1>
              <div className="mt-2 flex justify-center sm:justify-start items-center">
                <p className="text-lg mr-2">Rating:</p>
                <div className="flex">{displayStars(ratingInfo.averageRating)}</div>
                <p className="text-sm text-gray-500 ml-2">
                  ({ratingInfo.totalReviews} reviews)
                </p>
              </div>
              <p className="text-gray-600 mt-4">Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
              <p className="text-gray-600 mt-2">Duration: {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>
              <p className="text-gray-600 mt-2">Language: {movie.language || "N/A"}</p>
              <p className="text-gray-600 mt-2">Genre: {movie.genre_id.name || "N/A"}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  className="w-full sm:w-40 h-12 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleBookNow}
                >
                  Book Tickets
                </button>
                <a
                  href={movie.trailer_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-40 h-12 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                >
                  Watch Trailer
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">About the movie</h2>
            <p className="text-lg">{movie.description || "Description not available."}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 border-b-2 border-gray-300 pb-2">Cast</h3>
            <ul className="list-disc list-inside pl-4">
              {movie.cast.length > 0
                ? movie.cast.map((member, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-semibold">{member.actor_name}</span> as{" "}
                      <span className="italic">{member.character_name}</span>
                    </li>
                  ))
                : "Cast information not available."}
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 border-b-2 border-gray-300 pb-2">Crew</h3>
            <ul className="list-disc list-inside pl-4">
              {movie.crew.length > 0
                ? movie.crew.map((member, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-semibold">{member.crew_member}</span> -{" "}
                      <span className="italic">{member.role}</span>
                    </li>
                  ))
                : "Crew information not available."}
            </ul>
          </div>
        </div>
      </div>
      <Register isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
    </div>
  );
}

export default MovieDetails;
