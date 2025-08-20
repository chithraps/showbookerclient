import React, { useState,useEffect } from "react";
import EditScreenForm from "./EditScreenForm";
import EditLayoutForm from "../SeatingLayout/EditLayoutForm";
import EditRowForm from "../Rows/EditRowForm";
import { LiaRupeeSignSolid } from "react-icons/lia";

const ScreenDetailsModal = ({ isOpen, onClose, screenDetails }) => {
  const [isEditingScreen, setIsEditingScreen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);
  const [isEditingRow, setIsEditingRow] = useState(null);
  const [localScreenDetails, setLocalScreenDetails] = useState(screenDetails);
  useEffect(() => {
    if (screenDetails) {
      setLocalScreenDetails(screenDetails);
    }
  }, [screenDetails]);

  console.log("localScreenDetails ",localScreenDetails)

   if (!isOpen || !localScreenDetails) return null;
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
          {localScreenDetails.seating_layout_ids.map((layout) => (
                    <div
                      key={layout._id}
                      className="bg-gray-50 rounded-lg p-4 mb-6 shadow-md"
                    >
                      {/* Layout Header */}
                      <div className="flex justify-normal items-center mb-6">
                        <h5 className="text-base font-normal text-gray-700">
                          {layout.class_name}
                        </h5>
                        <p className="text-gray-500 flex items-center ml-4">
                          <LiaRupeeSignSolid /> {layout.price}
                        </p>
                      </div>
          
                      {/* Rows and Seats */}
                      {layout.row_ids.map((row, rowIndex) => (
                        <div
                          key={row._id}
                          className="flex items-center flex-wrap mb-4"
                          style={{
                            marginBottom:
                              row.space > 0 && rowIndex !== layout.row_ids.length - 1
                                ? `${row.space * 29}px`
                                : window.innerWidth < 768
                                ? "12px"
                                : "18px",
                          }}
                        >
                          <h5 className="font-medium text-gray-500 w-16 mr-4 sm:w-20 md:w-24 lg:w-32">
                            {row.row_name}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {row.seat_ids.map((seat) => (
                              <React.Fragment key={seat._id}>
                               
                                {seat.spacing > 0 &&
                                  seat.spacingPosition === "before" && (
                                    <div
                                      className="inline-block"
                                      style={{ width: `${seat.spacing * 29}px` }}
                                    ></div>
                                  )}
          
                                
                                <span
                                  role="button"
                                  aria-label={`Seat ${seat.seat_number} - ${
                                    layout.class_name
                                  } `}
                                  tabIndex={0}
                                 
                                  className={`inline-block w-6 h-6 text-center rounded border-2 cursor-pointer transition-colors duration-200 `}
                                  ey={seat._id}
                                  
                                >
                                  {seat.seat_number}
                                </span>
          
                                {/* Handle spacing after the seat */}
                                {seat.spacing > 0 && seat.spacingPosition === "after" && (
                                  <div
                                    className="inline-block"
                                    style={{ width: `${seat.spacing * 29}px` }}
                                  ></div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
        </div>
      </div>
    </div>
  );
};

export default ScreenDetailsModal;
