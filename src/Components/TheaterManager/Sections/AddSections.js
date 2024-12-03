import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

function AddSections({ formData, setFormData,onScreenAdded,handleScreenAdded }) {
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionNameError, setSectionNameError] = useState("");
  const layoutId = formData.seatingLayouts[0].layoutId;
  console.log("In section , layoutId ", layoutId);
  useEffect(() => {
    console.log("In section useEffect , layoutId ", layoutId);
    const fetchSeatingLayout = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/fetchClassId`, {
          params: {
            layoutId,
          },
        });
        const seatingLayoutDetails = response.data.classDetails;
        console.log(seatingLayoutDetails.class_name);
        setClassName(seatingLayoutDetails.class_name);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchSeatingLayout();
  }, [layoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionName) {
      setSectionNameError("Section name is required");
      return;
    } else {
      setSectionNameError("");
    }

    try {
     
      console.log("in addSection layoutId ", layoutId);
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(`${baseUrl}/tmAdmin/addSection`, {
        layoutId,
        sectionName,
      });

      if (response.status === 201) {
        console.log("After adding section ", response.data.sectionId);
        const newSectionId = response.data.sectionId; 

        const updatedFormData = {
          ...formData,
          seatingLayouts: formData.seatingLayouts.map((layout, layoutIndex) =>
            layoutIndex === 0 
              ? {
                  ...layout,
                  sections: layout.sections.map((section, sectionIndex) =>
                    sectionIndex === 0 
                      ? { ...section, sectionId: newSectionId }
                      : section
                  ),
                }
              : layout
          ),
        };

        setFormData(updatedFormData);
       
        console.log("Updated formData with sectionId:", updatedFormData);
        console.log(
          "Section ID after update:",
          updatedFormData.seatingLayouts[0].sections[0].sectionId
        );
        swal("Success", response.data.message, "success");
        setSectionName("");
        onScreenAdded();
        
      } else {
        swal("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding section:", error);
      swal("Error",error.response.data.message, "error");
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center p-8">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
        Add All Sections to {className}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md"
        >
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="sectionName"
            >
              Section Name
            </label>
            <input
              type="text"
              name="sectionName"
              id="sectionName"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {sectionNameError && (
              <p className="text-red-500 text-xs italic">{sectionNameError}</p>
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

export default AddSections;
