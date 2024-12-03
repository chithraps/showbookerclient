import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";

const EditRowForm = ({ row, onSave, onClose }) => {
  const [rowName, setRowName] = useState(row.row_name);
  const [space, setSpace] = useState(row.space);
  const [spacingPosition, setSpacingPosition] = useState(row.spacingPosition);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;
  const handleSave = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    try {
      const response = await axios.put(
        `${baseUrl}/tmAdmin/updateRow`,
        {
          rowId: row._id,
          space,
          spacingPosition,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        swal("Success", response.data.message);
      }
      onSave();
    } catch (error) {
      swal("Failed ", error.response.data.message);
      console.error("Error updating layout details:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">Edit Row</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium">Row Name</label>
        <input
          type="text"
          value={rowName}
          readOnly
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Space</label>
        <input
          type="number"
          value={space}
          onChange={(e) => setSpace(Number(e.target.value))}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Spacing Position</label>
        <select
          value={spacingPosition}
          onChange={(e) => setSpacingPosition(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="before">Before</option>
          <option value="after">After</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            console.log("Cancel clicked");
            onClose();
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditRowForm;
