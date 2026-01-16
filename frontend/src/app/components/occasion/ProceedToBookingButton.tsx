import React from "react";
import "../../booking/styles/booking.css";


const ProceedToBookingButton = () => {
  const handleClick = () => {
    alert("Proceeding to Caterer Matching...");
    // Future: Route to Caterer Listing Page
  };

  return (
    <div className="proceed-container">
      <button className="proceed-button" onClick={handleClick}>
        Proceed to Booking
      </button>
    </div>
  );
};

export default ProceedToBookingButton;
