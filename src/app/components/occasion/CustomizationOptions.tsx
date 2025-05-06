// components/CustomizationOptions.tsx

import React from "react";
import "../../booking/styles/coustomization.css"; // Adjust if needed

const CustomizationOptions = () => {
  return (
    <div className="customizationContainer">
      <h2>🎨 Customize Your Event</h2>
      <div className="options">
        <label>
          🎁 Theme:
          <select>
            <option>Traditional</option>
            <option>Modern</option>
            <option>Floral</option>
            <option>Bollywood</option>
          </select>
        </label>

        <label>
          🎶 Music Preference:
          <select>
            <option>Live Band</option>
            <option>DJ</option>
            <option>Classical</option>
            <option>No Music</option>
          </select>
        </label>

        <label>
          🪑 Seating Style:
          <select>
            <option>Buffet</option>
            <option>Sit-down Dining</option>
            <option>Floor Seating</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default CustomizationOptions;
