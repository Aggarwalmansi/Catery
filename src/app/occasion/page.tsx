"use client";
// ✅ Correct relative paths
import GuestCountInput from "../components/occasion/GuestCountInput";
import OccasionSelector from "../components/occasion/OccasionSelector";
import MenuAutoSuggest from "../components/occasion/MenuAutoSuggest";

import ProceedToBookingButton from "../components/occasion/ProceedToBookingButton";
import Footer from "../components/occasion/Footer";
import styles from "../../../styles/Occasion.module.css";


export default function OccasionPlannerPage() {
  return (
    <div className="occasion-container">
      <h1 className="title">Plan Your Occasion</h1>
      <GuestCountInput />
      <OccasionSelector />
      <MenuAutoSuggest />

      <ProceedToBookingButton />
      <Footer /> 
    </div>
  );
}
