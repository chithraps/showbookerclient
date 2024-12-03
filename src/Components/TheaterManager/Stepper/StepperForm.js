import React, { useState } from "react";
import AddScreen from "../Screens/AddScreens";
import SeatingLayout from "../SeatingLayout/SeatingLayout";
import AddRows from "../Rows/AddRows";
import AddSeats from "../Seats/AddSeats";

const steps = [
  { component: AddScreen },
  { component: SeatingLayout },
  { component: AddRows },
  { component: AddSeats },
];

function StepperForm({ onScreenAdded }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    screenId: "",
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

  return (
    <div className="p-4 bg-white shadow rounded">
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
