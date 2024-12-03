import React, { useState, useEffect } from "react";
import axios from "axios";
import AddShowTimingModal from "./AddShowTimingModal";
import EditShowTimingsModal from "./EditShowTimingsModal";
import { useSelector } from "react-redux";
function ViewShowsTable() {
  const [showTimings, setShowTimings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;
  console.log("theaterId ", theaterAdmin.theaterAdmin.theaterId);

  useEffect(() => {
    fetchShowTimings();
  }, [currentPage]);

  const fetchShowTimings = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${baseUrl}/tmAdmin/viewShowTimings`, {
        params: {
          page: currentPage,
          limit: 10,
          theaterId: theaterAdmin.theaterAdmin.theaterId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowTimings(response.data.showTimings || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching show timings:", error);
      setShowTimings([]);
    }
  };

  const handleSave = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    fetchShowTimings();
  };

  const handleEdit = (timing) => {
    setSelectedTiming(timing);
    setIsEditModalOpen(true);
  };

  const handleBlockToggle = async (timingId) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      await axios.patch(`${baseUrl}/tmAdmin/blockShowTiming/${timingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchShowTimings();
    } catch (error) {
      console.error("Error blocking show timing:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Show Timings</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setSelectedTiming(null);
            setIsAddModalOpen(true);
          }}
        >
          Add Show Timing
        </button>
      </div>
      {showTimings.length === 0 ? (
        <div className="text-center text-gray-500">
          No shows are available at the moment.
        </div>
      ) : (
        <div className="overflow-x-auto h-96">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Theater Name</th>
                <th className="py-2 px-4 text-left">Screen Name</th>
                <th className="py-2 px-4 text-left">Movie Title</th>
                <th className="py-2 px-4 text-left">Timings</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {showTimings.map((timing) => (
                <tr key={timing._id} className="border-t">
                  <td className="py-2 px-4">
                    {timing.theater_id?.name || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {timing.screen_id?.screen_number || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {timing.movie_id?.title || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {timing.timings ? timing.timings.join(", ") : "N/A"}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(timing)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${
                        timing.blockShow ? "bg-green-500" : "bg-red-500"
                      } text-white px-2 py-1 rounded hover:${
                        timing.blockShow ? "bg-green-600" : "bg-red-600"
                      }`}
                      onClick={() => handleBlockToggle(timing._id)}
                    >
                      {timing.blockShow ? "Activate" : "Block"}
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
        <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isAddModalOpen && (
        <AddShowTimingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {isEditModalOpen && (
        <EditShowTimingsModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          timing={selectedTiming}
        />
      )}
    </div>
  );
}

export default ViewShowsTable;
