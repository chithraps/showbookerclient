import React, { useState } from "react";
import AddScreen from "../Screens/AddScreens";
import SeatingLayout from "../SeatingLayout/SeatingLayout";
import AddRows from "../Rows/AddRows";
import AddSeats from "../Seats/AddSeats";
import { useSelector } from "react-redux";
import axios from "axios";
import swal from "sweetalert";

const steps = [
  { component: AddScreen },
  { component: SeatingLayout },
  { component: AddRows },
  { component: AddSeats },
];

function StepperForm({ onScreenAdded, handleClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    screenId: "",
    allSeatsStored: false,
    seatingLayouts: [
      {
        layoutId: "",
        rows: [
          {
            rowId: "",
            seats: [
              {
                seatNumber: "",
              },
            ],
          },
        ],
      },
    ],
  });
  const [submitted, setSubmitted] = useState(false);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const theaterId = theaterAdmin.theaterAdmin.theaterId;
  const token = theaterAdmin.theaterAdminAccessToken;

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    setSubmitted(false);
  };

  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleScreenAdded = () => {
    setSubmitted(true);

    goNext();
  };

  const StepComponent = steps[currentStep].component;

  const isNextEnabled = () => {
    if (currentStep === 1) {
      return formData.seatingLayouts.length > 0;
    }
    if (currentStep === 2) {
      return formData.seatingLayouts[0].rows.length > 0;
    }
    return true;
  };

  const handleTabClose = () => {
    console.log("closing tab ");
    if (!formData.allSeatsStored) {
      swal({
        title: "Incomplete Information",
        text: "Information regarding the screen is not stored fully. If you try to close it, the whole information will be lost.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            visible: true,
            className: "btn btn-secondary",
            closeModal: true,
          },
          confirm: {
            text: "Close",
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
        },
      }).then((result) => {
        if (result) {
          const screenId = formData.screenId;
          if (screenId) {
            console.log("screenId");
            const baseUrl = process.env.REACT_APP_BASE_URL;
          axios
            .delete(`${baseUrl}/tmAdmin/deleteScreen`, {
              params: { screenId },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log("API Response:", response.data);
              onScreenAdded();
              handleClose();
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
          }else{           
              handleClose();
          }
          
        }
      });
    } else {
      handleClose();
    }
  };

  return (
    <div className="relative p-4 bg-white shadow rounded">
      <button
        onClick={handleTabClose}
        className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-red-500"
        title="Close"
      >
        &times;
      </button>
      <StepComponent
        formData={formData}
        setFormData={updateFormData}
        onScreenAdded={onScreenAdded}
        handleScreenAdded={handleScreenAdded}
      />
      <div className="flex justify-between mt-2">
        <button
          onClick={goBack}
          className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${
            currentStep === 0 ? "invisible" : ""
          }`}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default StepperForm;
