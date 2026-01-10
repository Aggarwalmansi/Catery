import { useOccasion } from "@/app/context/OccasionContext"// fixed space typo
import '../../booking/styles/menu.css';



const mockMenus: Record<string, string[]> = {
  Birthday: ["Veg Manchurian", "Chowmein", "Cake", "Cold Drink"],
  Housewarming: ["Chole Bhature", "Paneer Tikka", "Gulab Jamun", "Nimbu Pani"],
  "Grih Pravesh": ["Puri Sabzi", "Halwa", "Kheer", "Pulao"],
  Wedding: ["Dal Makhni", "Shahi Paneer", "Naan", "Rasmalai"],
  Anniversary: ["Tandoori Platter", "Pasta", "Pastry", "Mocktails"],
};

export default function MenuAutoSuggest() {
  const { selectedOccasion } = useOccasion();

  const menu = selectedOccasion ? mockMenus[selectedOccasion] || [] : [];

  return (
    <div className="menu-suggestion-section">
      <h3>AI-Generated Menu Suggestions:</h3>
      {selectedOccasion ? (
        <ul className="menuList">
          {menu.map((item, index) => (
            <li key={index} className="menuItem">
              🍽️ {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>Please select an occasion to view menu suggestions.</p>
      )}
    </div>
  );
}
