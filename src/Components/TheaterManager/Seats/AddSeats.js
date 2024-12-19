import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useSelector } from "react-redux";

function AddSeats({ formData, setFormData, onScreenAdded }) {
  const [rowName, setRowName] = useState("");
  const [startSeatNumber, setStartSeatNumber] = useState("");
  const [endSeatNumber, setEndSeatNumber] = useState("");
  const [seatNumberError, setSeatNumberError] = useState("");
  const [spacing, setSpacing] = useState(0);
  const [spacingError, setSpacingError] = useState("");
  const [gapAfter, setGapAfter] = useState(0);
  const [spacingPosition, setSpacingPosition] = useState("after");

  const rowId = formData.seatingLayouts[0].rows[0].rowId;
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;
  useEffect(() => {
    const fetchRow = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/fetchRowDetails`, {
          params: { rowId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRowName(response.data.rowDetails.row_name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRow();
  }, [rowId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert input values to numbers for comparison
    const start = Number(startSeatNumber);
    const end = Number(endSeatNumber);

    if (!start || !end || start > end) {
      console.log("startSeatNumber endSeatNumber ", start, " ", end);
      console.log(start > end ? true : false);
      setSeatNumberError("Please enter a valid seat number range.");
      return;
    } else {
      setSeatNumberError("");
    }

    if (spacing < 0) {
      setSpacingError("Spacing cannot be a negative number.");
      return;
    } else {
      setSpacingError("");
    }

    try {
      const screenId = formData.screenId;
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/tmAdmin/addSeats`,
        {
          screenId,
          rowId,
          startSeatNumber: start,
          endSeatNumber: end,
          sSpacing: spacing,
          gapAfter,
          spacingPosition,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const { allSeatsStored, message } = response.data;
        console.log(" All seats occured  ",allSeatsStored)
        const updatedFormData = { ...formData };
        if (allSeatsStored) {
          updatedFormData.allSeatsStored = true;
          swal("Success", "All seats are filled successfully", "success");
        }
        setFormData(updatedFormData);
        swal("Success", response.data.message, "success");
        setStartSeatNumber(0);
        setEndSeatNumber(0);
        setSpacing(0);
        setGapAfter(0);
        setSpacingPosition("after");
      } else {
        swal("Error", response.data.message, "error");
      }
    } catch (error) {
      swal("Error", error.response.data.message, "error");
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">
          Adding Seats to Row: {rowName}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-medium mb-1"
              htmlFor="seatNumber"
            >
              Seat Number Range
            </label>
            <div className="flex space-x-1">
              <input
                type="number"
                name="startSeatNumber"
                id="startSeatNumber"
                value={startSeatNumber}
                onChange={(e) => setStartSeatNumber(e.target.value)}
                required
                placeholder="Start"
                className="shadow appearance-none border rounded w-1/2 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="number"
                name="endSeatNumber"
                id="endSeatNumber"
                value={endSeatNumber}
                onChange={(e) => setEndSeatNumber(e.target.value)}
                required
                placeholder="End"
                className="shadow appearance-none border rounded w-1/2 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {seatNumberError && (
              <p className="text-red-500 text-xs italic mt-1">
                {seatNumberError}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-medium mb-1"
              htmlFor="spacing"
            >
              Additional Space Between Seats (in number of seats, optional)
            </label>
            <input
              type="number"
              name="spacing"
              id="spacing"
              value={spacing}
              onChange={(e) => setSpacing(e.target.value)}
              placeholder="Enter number of empty seats"
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {spacingError && (
              <p className="text-red-500 text-xs italic mt-1">{spacingError}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Spacing Position
            </label>
            <div className="flex space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="spacingPosition"
                  value="before"
                  checked={spacingPosition === "before"}
                  onChange={(e) => setSpacingPosition(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-1">Before</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="spacingPosition"
                  value="after"
                  checked={spacingPosition === "after"}
                  onChange={(e) => setSpacingPosition(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-1">After</span>
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-medium mb-1"
              htmlFor="gapAfter"
            >
              Add Space After/Before the Following Seat (Optional)
            </label>
            <input
              type="number"
              name="gapAfter"
              id="gapAfter"
              value={gapAfter}
              onChange={(e) => setGapAfter(e.target.value)}
              placeholder="Gap after this range"
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Seats
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSeats;
