import { useOccasion } from "@/app/context/OccasionContext";// removed extra space
import '../../booking/styles/selectOccasion.css';



const occasions = [
  { label: "Birthday", emoji: "🎉" },
  { label: "Housewarming", emoji: "🏠" },
  { label: "Grih Pravesh", emoji: "🚪" },
  { label: "Wedding", emoji: "💍" },
  { label: "Anniversary", emoji: "❤️" },
];

export default function OccasionSelector() {
  const { selectedOccasion, setSelectedOccasion } = useOccasion();

  return (
    <div className="occasion-section">
      <h3>Select Occasion Type:</h3>
      <div className="occasion-grid">
        {occasions.map((occ) => (
          <div
            key={occ.label}
            className={`occasion-card ${selectedOccasion === occ.label ? "selected" : ""}`}
            onClick={() => setSelectedOccasion(occ.label)}
          >
            <span className="emoji">{occ.emoji}</span>
            <p>{occ.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
