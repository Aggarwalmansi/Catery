// app/booking/caterer-profile/components/BookingForm.tsx
"use client";
import { useState } from "react";

type Props = {
  catererId: string;
};

const BookingForm = ({ catererId }: Props) => {
  const [plates, setPlates] = useState(0);
  const [eventDate, setEventDate] = useState("");

  const handleSubmit = () => {
    alert(`Booking ${plates} plates for ${eventDate} with ID ${catererId}`);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <label>
        Number of Plates:
        <input
          type="number"
          value={plates}
          onChange={(e) => setPlates(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Event Date:
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSubmit}>Book Now</button>
    </div>
  );
};

export default BookingForm;
