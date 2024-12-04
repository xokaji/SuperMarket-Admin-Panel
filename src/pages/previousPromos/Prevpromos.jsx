import React, { useEffect, useState } from 'react'; 
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './prevpromos.css'; // For custom styles

export default function PrevPromos() {
  const [promotions, setPromotions] = useState([]);

  // Fetch promotion data from Firestore
  useEffect(() => {
    const fetchPromotions = async () => {
      const promoCollection = collection(db, 'promotions'); 
      const promoSnapshot = await getDocs(promoCollection);
      const promoList = promoSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromotions(promoList);
    };

    fetchPromotions();
  }, []);

  // Function to handle deleting a promotion
  // Function to handle deleting a promotion
const handleDelete = async (id) => {
  console.log("Attempting to delete promotion with id:", id);

  try {
    // Ensure ID is in string format before passing to Firestore
    const promoIdString = String(id).trim();

    // Check if the ID is a valid non-empty string
    if (!promoIdString) {
      throw new Error("Invalid ID: ID is empty or invalid");
    }

    // Log the type of id
    console.log("Type of ID:", typeof promoIdString);

    // Log the ID before deletion
    console.log("ID to delete (as string):", promoIdString);

    // Delete the promotion from Firestore using the document ID directly
    await deleteDoc(doc(db, 'promotions', promoIdString));
    
    // Update state to remove the deleted promotion
    setPromotions((prevPromos) => prevPromos.filter((promo) => promo.id !== promoIdString));
    
    console.log("Promotion deleted successfully:", promoIdString);
  } catch (error) {
    console.error("Error deleting promotion:", error);
  }
};


  // Convert Firestore Timestamp to a readable date
  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return '';
  };

  return (
    <div className="prev-container">
      <h2>Previous Promotions</h2>
      {promotions.length > 0 ? (
        <table className="promo-table">
          <thead>
            <tr>
              <th>Promo ID</th>
              <th>Promo Banner</th>
              <th>Promo Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id}>
                <td>{promo.id}</td>
                <td>
                  {promo.imageUrl ? (
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="promo-img"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{promo.title}</td>
                <td>{promo.description}</td>
                {/* <td>{formatDate(promo.startDate)}</td>
                <td>{formatDate(promo.endDate)}</td> */}
                <td>
                  <button
                    onClick={() => handleDelete(promo.id)} // Use the document ID directly
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='no-promo-msg'>No promotions found.</p>
      )}
    </div>
  );
}
