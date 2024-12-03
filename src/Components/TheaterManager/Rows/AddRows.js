import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useSelector } from "react-redux";

function AddRows({ formData, setFormData, onScreenAdded, handleScreenAdded }) {
  const [layoutDetails, setLayoutDetails] = useState("");
  const [rowName, setRowName] = useState("");
  const [rowNameError, setRowNameError] = useState("");
  const [space, setSpace] = useState(0);
  const [spaceError, setSpaceError] = useState("");
  const layoutId = formData.seatingLayouts[0].layoutId;
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;

  useEffect(() => {
    const fetchLayoutDetails = async () => {
      try {
        console.log("In addRows ", layoutId);
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/fetchClassId`, {
          params: { layoutId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log(response.data.classDetails);
          setLayoutDetails(response.data.classDetails);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchLayoutDetails();
  }, [layoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rowName) {
      setRowNameError("Row name is required");
      return;
    } else {
      setRowNameError("");
    }

    if (space < 0) {
      setSpaceError("Space should be a positive number");
      return;
    } else {
      setSpaceError("");
    }

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/tmAdmin/addRows`,
        {
          layoutId,
          rowName,
          space,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        swal("Success", response.data.message, "success");
        const newRowId = response.data.rowId;
        console.log("newly added rowId is ", response.data.rowId);

        const updatedFormData = {
          ...formData,
          seatingLayouts: formData.seatingLayouts.map((layout, layoutIndex) =>
            layoutIndex === 0
              ? {
                  ...layout,
                  rows: [
                    {
                      rowId: newRowId,
                      rowName,
                      space,
                      seats: [],
                    },
                  ],
                }
              : layout
          ),
        };

        setFormData(updatedFormData);
        setRowName("");
        setSpace(0);
        onScreenAdded();
        handleScreenAdded();
      } else {
        swal("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding rows:", error);
      swal("Error", error.response?.data?.message, "error");
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center p-8">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Add Row to {layoutDetails.class_name}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rowName"
            >
              Row Name
            </label>
            <input
              type="text"
              name="rowName"
              id="rowName"
              value={rowName}
              onChange={(e) => setRowName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {rowNameError && (
              <p className="text-red-500 text-xs italic">{rowNameError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="space"
            >
              Space between Rows
            </label>
            <input
              type="number"
              name="space"
              id="space"
              value={space}
              onChange={(e) => setSpace(Number(e.target.value))}
              placeholder="Enter space"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {spaceError && (
              <p className="text-red-500 text-xs italic">{spaceError}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRows;
