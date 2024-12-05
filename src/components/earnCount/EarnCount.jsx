import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust this import based on your Firebase configuration

export default function EarnCount() {
  const [totalEarnings, setTotalEarnings] = useState(0);  // Store total earnings (price) for today

  useEffect(() => {
    const fetchTodayEarnings = async () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      try {
        // Reference the 'transactions' collection in Firestore
        const transactionsRef = collection(db, 'transactions');
        const querySnapshot = await getDocs(transactionsRef);

        let total = 0;

        // Loop through each document and sum up the earnings of all transactions
        querySnapshot.forEach(doc => {
          const transactionData = doc.data();

          // Combine date and time to form a complete timestamp
          const fullTimestamp = new Date(`${transactionData.date} ${transactionData.time}`);
          console.log('Transaction Timestamp:', fullTimestamp); // Output combined timestamp

          // Check if the transaction is from today
          if (fullTimestamp >= startOfDay && fullTimestamp < endOfDay) {
            // Log the data to check its format
            console.log('Transaction Data:', transactionData);

            // Add the transaction amount to the total earnings
            total += transactionData.amount; // Sum up the amount (total price) of each transaction
          }
        });

        setTotalEarnings(total); // Set the total earnings for today's transactions
      } catch (error) {
        console.error('Error fetching today\'s transactions:', error);
      }
    };

    fetchTodayEarnings();
  }, []);

  return <>{totalEarnings}</>;  // Render the total earnings for today
}
