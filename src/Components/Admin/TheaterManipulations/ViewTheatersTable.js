import React, { useState, useEffect } from "react";
import axios from "axios";
import EditTheater from "./EditTheater";
import AddTheater from "./AddTheater"; // Import AddTheater modal
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSuperAdmin } from "../../../Features/AdminActions";
import swal from "sweetalert";

function ViewTheatersTable() {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for AddTheaterModal
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminAccessToken = admin.adminAccessToken;

  const fetchTheaters = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/admin/viewTheaters`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
      setTheaters(response.data.theaters);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching theaters:", error);
      if (error.response?.data?.message === "Unauthorized: Token has expired") {
        swal({
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
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, [page, limit]);

  const handleEditClick = (theater) => {
    setSelectedTheater(theater);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTheater(null);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };
  const handleTheaterAdded = () => {
    fetchTheaters();
    handleAddModalClose();
  };

  const handleSaveChanges = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const theaterId = selectedTheater._id;
      await axios.put(
        `${baseUrl}/admin/editTheater/${theaterId}`,
        selectedTheater,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      const updatedTheaters = theaters.map((theater) =>
        theater._id === selectedTheater._id ? selectedTheater : theater
      );
      setTheaters(updatedTheaters);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating theater:", error);
    }
  };
  const handleToggleStatusClick = async (theater) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const newStatus = !theater.isDeleted;
      await axios.put(
        `${baseUrl}/admin/deleteTheater/${theater._id}`,
        { isDeleted: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      setTheaters((prevTheaters) =>
        prevTheaters.map((t) =>
          t._id === theater._id ? { ...t, isDeleted: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Error toggling theater status:", error);
    }
  };


  return (
    <div className="flex-grow p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Theaters</h1>
        <button
          onClick={handleAddClick} // Open AddTheaterModal
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Register Theater and Manager
        </button>
      </div>
      <div className="overflow-x-auto h-96">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Location</th>
              <th className="py-2 px-4 border-b text-left">City</th>
              <th className="py-2 px-4 border-b text-left">State</th>
              <th className="py-2 px-4 border-b text-left">Manager Email</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((theater) => (
              <tr key={theater._id}>
                <td className="py-2 px-4 border-b">{theater.name}</td>
                <td className="py-2 px-4 border-b">{theater.location}</td>
                <td className="py-2 px-4 border-b">{theater.city}</td>
                <td className="py-2 px-4 border-b">{theater.state}</td>
                <td className="py-2 px-4 border-b">
                  {theater.manager?.email || "Not Assigned"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(theater)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatusClick(theater)}
                    className={`${
                      theater.isDeleted ? "text-green-500" : "text-red-500"
                    } hover:underline`}
                  >
                    {theater.isDeleted ? "Activate" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

      {isModalOpen && (
        <EditTheater
          isOpen={isModalOpen}
          theater={selectedTheater}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
      {isAddModalOpen && (
        <AddTheater
          isOpen={isAddModalOpen}
          onClose={handleAddModalClose}
          onTheaterAdded={handleTheaterAdded}
        />
      )}
    </div>
  );
}

export default ViewTheatersTable;
