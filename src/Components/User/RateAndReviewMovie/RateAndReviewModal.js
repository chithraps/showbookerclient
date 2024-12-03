import React, { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import axios from "axios";
import swal from "sweetalert";

function RateReviewModal({ isOpen, onClose, movieId, userId }) {
  const user = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const token = user.accessToken;
  const handleRatingChange = (e) => setRating(e.target.value);
  const handleReviewChange = (e) => setReview(e.target.value);

  const submitReview = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/rateMovie`,
        {
          user_id: userId,
          movie_id: movieId,
          rating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Review submitted successfully");
        swal("success", "Review submitted successfully");
      } else if (response.status === 400) {
        swal("Warning", response.data.message);
      }

      setRating(0);
      setReview("");

      onClose();
    } catch (error) {
      swal("Warning", error.response.data.message);      
      console.error("Failed to submit review:", error);
      setRating(0);
      setReview("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex items-center justify-center min-h-screen"
      overlayClassName="bg-black bg-opacity-50 fixed inset-0 z-50 flex justify-center items-center"
    >
      <div className="relative bg-white rounded-lg shadow-lg w-96 max-w-full p-6">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Rate & Review</h2>

        {/* Rating Input */}
        <div className="mb-4">
          <label className="block mb-2">Rating (out of 5):</label>
          <input
            type="number"
            min="0"
            max="5"
            value={rating}
            onChange={handleRatingChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>

        {/* Review Input */}
        <div className="mb-4">
          <label className="block mb-2">Review:</label>
          <textarea
            value={review}
            onChange={handleReviewChange}
            rows="5"
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          ></textarea>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={submitReview}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default RateReviewModal;
