// app/booking/caterer-profile/components/CatererDetails.tsx
type Props = {
    catererId: string;
  };
  
  const CatererDetails = ({catererId }: Props) => {
    return (
      <div>
        <h2>Shree Ram Caterers</h2>
        <p>Cuisine: North Indian, Jain</p>
        <p>Price: ₹250/plate</p>
        <p>Rating: ⭐ 4.5</p>
      </div>
    );
  };
  
  export default CatererDetails;
  