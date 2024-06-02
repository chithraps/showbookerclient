import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    width: "450px", // Adjust the width as needed
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

function LocationModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-center flex-grow">
          Select Location
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <IoMdClose />
        </button>
      </div>
      <div className="container mx-auto flex justify-between items-center">
        <div className="ml-3 relative">
          <input
            type="text"
            placeholder="Search here"
            className="w-96 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LocationModal;
