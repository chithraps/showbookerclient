import React, { useEffect, useState } from "react";
import axios from "axios";
import NewMovieModal from "./NewMovieModal";
import EditMovieModal from "./EditMovieModal";
import Swal from "sweetalert";
import { useSelector,useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSuperAdmin } from "../../../Features/AdminActions";

function MoviesTable() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin.adminAccessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchMovies = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/admin/viewMovies`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });

      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Error fetching movies");
      console.error("Error fetching movies:", error);
      if (error.response?.data?.message === "Unauthorized: Token has expired") {
        Swal({
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willLogout) => {
          if (willLogout) {
            dispatch(logoutSuperAdmin());
            navigate("/admin");
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, limit]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  const handleAddMovieClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMovieSave = () => {
    fetchMovies();
  };

  const handleToggleBlockMovie = async (movieId) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const movie = movies.find((m) => m._id === movieId);
      const updatedStatus = !movie.blocked;
      await axios.put(`${baseUrl}/admin/toggleBlockMovie/${movieId}`,
        {},
        {
        
        headers: {          
          Authorization: `Bearer ${adminAccessToken}`,
        }
      });

      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === movieId ? { ...movie, blocked: updatedStatus } : movie
        )
      );

      Swal("Updated!", "The movie block status has been updated.", "success");
    } catch (error) {
      Swal(
        "Error",
        "An error occurred while updating the movie block status.",
        "error"
      );
    }
  };

  const handleUpdateMovie = (updatedMovie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === updatedMovie._id ? updatedMovie : movie
      )
    );
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setIsEditModalOpen(true);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setPage(1);
  };

  const filteredMovies = selectedLanguage
    ? movies.filter((movie) => movie.language === selectedLanguage)
    : movies;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Movies</h1>
        <div className="flex space-x-2">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="px-4 py-2 border rounded"
          >
            <option value="">All Languages</option>
            {Array.from(new Set(movies.map((movie) => movie.language))).map(
              (language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              )
            )}
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddMovieClick}
          >
            Add New Movie
          </button>
        </div>
      </div>
      {filteredMovies.length === 0 ? (
        <div className="text-center text-gray-500">No movies available.</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Genre</th>
              <th className="py-2">Release Date</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Language</th>
              <th className="py-2">Created At</th>
              <th className="py-2">Updated At</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie) => (
              <tr key={movie._id} className="border-t">
                <td className="py-2 px-4">{movie.title}</td>
                <td className="py-2 px-4">{movie.genre_id.name}</td>
                <td className="py-2 px-4">
                  {new Date(movie.release_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{movie.duration} minutes</td>
                <td className="py-2 px-4">{movie.language}</td>
                <td className="py-2 px-4">
                  {new Date(movie.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(movie.updated_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      className={`px-2 py-1 rounded ${
                        movie.blocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                      onClick={() => handleToggleBlockMovie(movie._id)}
                    >
                      {movie.blocked ? "Activate" : "Block"}
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditMovie(movie)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <span className="px-3 py-1">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
      {showModal && (
        <NewMovieModal onClose={handleModalClose} onSave={handleMovieSave} />
      )}
      {isEditModalOpen && (
        <EditMovieModal
          movie={selectedMovie}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateMovie}
        />
      )}
    </div>
  );
}

export default MoviesTable;
