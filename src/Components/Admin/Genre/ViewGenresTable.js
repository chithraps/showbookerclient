import React, { useState, useEffect } from "react";
import axios from "axios";
import NewGenreModal from "./NewGenreModal";
import EditGenreModal from "./EditGenreModal";
import { useNavigate } from "react-router-dom";
import { logoutSuperAdmin } from "../../../Features/AdminActions";
import Swal from "sweetalert";
import { useSelector, useDispatch } from "react-redux";

function ViewGenresTable() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const admin = useSelector((state) => state.admin);
  console.log("admin and token ", admin.admin, " ", admin.adminAccessToken);
  const adminAccessToken = admin.adminAccessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("in viewGne ");
    if (!adminAccessToken) {
      console.error("No admin access token available");
      return;
    }
    fetchGenres(currentPage);
  }, [currentPage]);

  const fetchGenres = async (page) => {
    try {
      console.log("admin.adminAccessToken ", admin.adminAccessToken);
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/admin/viewGenres?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      setGenres(response.data.genres);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Error fetching genres");
      console.error("Error fetching genres:", error);
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

  const handleSaveGenre = (newGenre) => {
    setGenres((prevGenres) => [...prevGenres, newGenre]);
  };

  const handleUpdateGenre = (updatedGenre) => {
    setGenres((prevGenres) =>
      prevGenres.map((genre) =>
        genre._id === updatedGenre._id ? updatedGenre : genre
      )
    );
  };

  const handleToggleBlockGenre = async (genreId) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.put(
        `${baseUrl}/admin/toggleBlockGenre/${genreId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      setGenres((prevGenres) =>
        prevGenres.map((genre) =>
          genre._id === genreId
            ? { ...genre, blockGenre: response.data.genre.blockGenre }
            : genre
        )
      );
      Swal("Updated!", "The genre block status has been updated.", "success");
    } catch (error) {
      Swal(
        "Error",
        "An error occurred while updating the genre block status.",
        "error"
      );
    }
  };

  const handleEditClick = (genre) => {
    setSelectedGenre(genre);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Genres</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Genre
        </button>
      </div>
      {genres.length === 0 ? (
        <div className="text-center text-gray-500"></div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Description</th>
                <th className="py-2">Created At</th>
                <th className="py-2">Updated At</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre._id} className="border-t">
                  <td className="py-2 px-4">{genre.name}</td>
                  <td className="py-2 px-4">{genre.description}</td>
                  <td className="py-2 px-4">
                    {new Date(genre.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(genre.updated_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(genre)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${
                        genre.blockGenre ? "bg-green-500" : "bg-red-500"
                      } text-white px-2 py-1 rounded hover:${
                        genre.blockGenre ? "bg-green-600" : "bg-red-600"
                      }`}
                      onClick={() => handleToggleBlockGenre(genre._id)}
                    >
                      {genre.blockGenre ? "Activate" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {isModalOpen && (
        <NewGenreModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveGenre}
        />
      )}
      {isEditModalOpen && (
        <EditGenreModal
          genre={selectedGenre}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateGenre}
        />
      )}
    </div>
  );
}

export default ViewGenresTable;
