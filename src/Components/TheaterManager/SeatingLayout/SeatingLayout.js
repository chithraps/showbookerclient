import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useSelector } from "react-redux";

function SeatingLayout({
  formData,
  setFormData,
  onScreenAdded,
  handleScreenAdded,
}) {
  const [errors, setErrors] = useState({});
  const [screenNumber, setScreenNumber] = useState("");
  const [className, setClassName] = useState("");
  const [price, setPrice] = useState("");
  const [seatCapacity, setSeatCapacity] = useState("");
  const currentScreenId = formData.screenId;
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;

  const validateForm = () => {
    const errors = {};
    if (!className) {
      errors.className = "Class name is required.";
    }
    if (!price) {
      errors.price = "Price is required.";
    } else if (isNaN(price)) {
      errors.price = "Price must be a number.";
    }
    if (!seatCapacity) {
      errors.seatCapacity = "Seat capacity is required.";
    } else if (isNaN(seatCapacity)) {
      errors.seatCapacity = "Seat capacity must be a number.";
    }
    return errors;
  };

  useEffect(() => {
    const fetchScreen = async () => {
      try {
        console.log("screenId ", currentScreenId);
        console.log("Form data ", formData);
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/fetchScreen`, {
          params: {
            currentScreenId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const number = response.data.screenDetails.screen_number;
        console.log("Screen number ", number);
        setScreenNumber(number);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchScreen();
  }, [currentScreenId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const screenId = formData.screenId;
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/tmAdmin/addSeatingLayout`,
        {
          screenId,
          className,
          price,
          seatCapacity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const newLayoutId = response.data.classId;
        const updatedFormData = {
          ...formData,
          seatingLayouts: formData.seatingLayouts.map((layout, index) =>
            index === 0 ? { ...layout, layoutId: newLayoutId } : layout
          ),
        };

        setFormData(updatedFormData);

        console.log("Updated formData:", updatedFormData);
        console.log("layout id ", updatedFormData.seatingLayouts[0].layoutId);
        swal("Success", response.data.message, "success");

        setClassName("");
        setPrice("");
        setSeatCapacity(""); // Reset seat capacity field
        onScreenAdded();
        handleScreenAdded();
      } else {
        swal("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error creating SeatingLayout", error);
      swal("Error", error.response.data.message, "error");
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center p-8">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Adding Seating Layout to screen {screenNumber}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="className"
            >
              Class Name
            </label>
            <input
              type="text"
              name="className"
              id="className"
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.className ? "border-red-500" : ""
              }`}
            />
            {errors.className && (
              <p className="text-red-500 text-xs italic">{errors.className}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs italic">{errors.price}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="seatCapacity"
            >
              Seat Capacity of seating layout
            </label>
            <input
              type="number"
              name="seatCapacity"
              id="seatCapacity"
              value={seatCapacity}
              onChange={(e) => {
                setSeatCapacity(e.target.value);
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.seatCapacity ? "border-red-500" : ""
              }`}
            />
            {errors.seatCapacity && (
              <p className="text-red-500 text-xs italic">
                {errors.seatCapacity}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Layout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SeatingLayout;
