import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust this import based on your Firebase configuration

export default function SalesCount() {
  const [totalQuantity, setTotalQuantity] = useState(0);  // Store total quantity of items for today

  useEffect(() => {
    const fetchTodayTransactions = async () => {
      // Get start and end timestamps for the current day
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      try {
        // Reference the 'transactions' collection in Firestore
        const transactionsRef = collection(db, 'transactions');
        const todayQuery = query(
          transactionsRef,
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<', endTimestamp)
        );

        // Execute the query to get all today's transactions
        const querySnapshot = await getDocs(todayQuery);

        let total = 0;
        
        // Loop through each document and sum up the quantities of all items
        querySnapshot.forEach(doc => {
          const transactionData = doc.data();

          // Combine date and time to form a complete timestamp
          const fullTimestamp = new Date(`${transactionData.date} ${transactionData.time}`);
          console.log('Transaction Timestamp:', fullTimestamp); // Output combined timestamp

          // Loop through items and sum the quantities
          if (transactionData.items) {
            Object.keys(transactionData.items).forEach(key => {
              total += transactionData.items[key].quantity; // Sum up the quantity of each item
            });
          }
        });

        setTotalQuantity(total); // Set the total quantity for today's transactions
      } catch (error) {
        console.error('Error fetching today\'s transactions:', error);
      }
    };

    fetchTodayTransactions();
  }, []);

  return <>{totalQuantity}</>;  // Render the total quantity of items sold today
}
