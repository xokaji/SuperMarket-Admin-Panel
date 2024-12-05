import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust this import based on your Firebase configuration

export default function FrescoRegCount() {
  const [registrationCount, setRegistrationCount] = useState(0); // Store the registration count

  useEffect(() => {
    const fetchRegistrationCount = async () => {
      try {
        // Reference the 'Fresco_Registration' collection in Firestore
        const registrationRef = collection(db, 'Fresco_Registration');
        const querySnapshot = await getDocs(registrationRef);

        // The count of users is simply the number of documents in the collection
        setRegistrationCount(querySnapshot.size); // Set the registration count
      } catch (error) {
        console.error('Error fetching registration count:', error);
      }
    };

    fetchRegistrationCount();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return <>{registrationCount}</>; // Render the registration count
}
