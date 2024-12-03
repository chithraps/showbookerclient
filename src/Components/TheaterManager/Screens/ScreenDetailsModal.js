import React, { useState } from "react";
import EditScreenForm from "./EditScreenForm";
import EditLayoutForm from "../SeatingLayout/EditLayoutForm";
import EditRowForm from "../Rows/EditRowForm";
import { LiaRupeeSignSolid } from "react-icons/lia";

const ScreenDetailsModal = ({ isOpen, onClose, screenDetails }) => {
  const [isEditingScreen, setIsEditingScreen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);
  const [isEditingRow, setIsEditingRow] = useState(null);
  const [localScreenDetails, setLocalScreenDetails] = useState(screenDetails);

  if (!isOpen || !screenDetails) return null;
  const handleScreenSave = (updatedScreen) => {
    setLocalScreenDetails((prev) => ({
      ...prev,
      ...updatedScreen,
    }));
    setIsEditingScreen(false);
  };

  const handleEditClick = (type, id) => {
    switch (type) {
      case "screen":
        setIsEditingScreen(!isEditingScreen);
        break;
      case "layout":
        setEditingLayout(
          screenDetails.seating_layout_ids.find((layout) => layout._id === id)
        );
        break;
      case "row":
        setIsEditingRow(id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px] h-[95vh] relative mt-12 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <div className="overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Screen Details
          </h2>
          <table className="min-w-full bg-white border border-gray-200 mb-6">
            <tbody>
              <tr>
                <th>Screen Number</th>
                <th>Capacity</th>
                <th>Sound System</th>
                <th>Actions</th>
              </tr>
              <tr>
                <td>{screenDetails.screen_number}</td>
                <td>{screenDetails.capacity}</td>
                <td>{screenDetails.sound_system}</td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsEditingScreen(true)}
                  >
                    Edit Screen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {isEditingScreen && (
            <EditScreenForm
              selectedScreen={screenDetails}
              onSave={handleScreenSave}
              onClose={() => setIsEditingScreen(false)}
            />
          )}

          {/* Seating Layouts Table */}
          <h3 className="text-xl font-semibold mb-2 text-center">
            Seating Layouts of screen {screenDetails.screen_number}
          </h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Class Name</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {screenDetails.seating_layout_ids &&
              screenDetails.seating_layout_ids.length > 0 ? (
                screenDetails.seating_layout_ids.map((layout) => (
                  <React.Fragment key={layout._id}>
                    <tr>
                      <td className="py-2 px-4 border-b">
                        {layout.class_name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex items-center">
                          <LiaRupeeSignSolid className="mr-1" />
                          <span>{layout.price}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEditClick("layout", layout._id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        >
                          {editingLayout && editingLayout._id === layout._id
                            ? "Cancel"
                            : "Edit Layout"}
                        </button>
                      </td>
                    </tr>
                    {editingLayout && editingLayout._id === layout._id && (
                      <tr>
                        <td colSpan="3" className="py-2 px-4 border-b">
                          <EditLayoutForm
                            layout={editingLayout}
                            onSave={() => setEditingLayout(null)}
                            onClose={() => setEditingLayout(null)}
                          />
                        </td>
                      </tr>
                    )}

                    {/* Rows */}
                    <tr>
                      <td colSpan="3" className="py-2 px-4 border-b">
                        <h4 className="text-lg font-semibold mb-2 text-center">
                          Rows of {layout.class_name}
                        </h4>
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b text-left">
                                Row Name
                              </th>
                              <th className="py-2 px-4 border-b text-left">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {layout.row_ids && layout.row_ids.length > 0 ? (
                              layout.row_ids.map((row) => (
                                <React.Fragment key={row._id}>
                                  <tr>
                                    <td className="py-2 px-4 border-b">
                                      Row: {row.row_name}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                      <button
                                        onClick={() =>
                                          handleEditClick("row", row._id)
                                        }
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                      >
                                        {isEditingRow === row._id
                                          ? "Cancel"
                                          : "Edit Row"}
                                      </button>
                                    </td>
                                  </tr>
                                  {isEditingRow === row._id && (
                                    <tr>
                                      <td
                                        colSpan="2"
                                        className="py-2 px-4 border-b"
                                      >
                                        <EditRowForm
                                          row={row}
                                          onSave={() => {
                                            console.log(
                                              "Save clicked, resetting isEditingRow"
                                            );
                                            setIsEditingRow(null);
                                          }}
                                          onClose={() => {
                                            console.log(
                                              "Close clicked, resetting isEditingRow"
                                            );
                                            setIsEditingRow(null);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  )}

                                  {/* Seats */}
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="py-2 px-4 border-b"
                                    >
                                      <h5 className="text-sm font-semibold mb-2 text-center">
                                        Seats in Row {row.row_name}
                                      </h5>
                                      <div className="grid grid-cols-12 gap-1">
                                        {row.seat_ids &&
                                        row.seat_ids.length > 0 ? (
                                          row.seat_ids.map((seat) => (
                                            <span
                                              key={seat._id}
                                              className="py-1 px-2 border border-gray-300 text-center rounded-md text-xs bg-gray-200"
                                            >
                                              {seat.seat_number}
                                            </span>
                                          ))
                                        ) : (
                                          <p className="text-gray-500">
                                            No seats available.
                                          </p>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="2" className="py-2 px-4 border-b">
                                  No rows available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-2 px-4 border-b">
                    No seating layouts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetailsModal;
