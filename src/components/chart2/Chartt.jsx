import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../../firebase'; // Ensure this is correctly pointing to your firebase.js file
import { collection, getDocs } from 'firebase/firestore';
import './chartt.css';

export default function Chartt({ title, grid }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const transactionsCollection = collection(db, 'transactions');  // Get transactions collection
      const transactionsSnapshot = await getDocs(transactionsCollection);

      // Get the current date to filter transactions from today
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set time to 00:00
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set time to 23:59

      // Array to hold the count of transactions for each hour (0 - 23)
      const hourlySalesData = Array(24).fill(0);

      transactionsSnapshot.forEach(doc => {
        const transactionData = doc.data();
        const timestamp = transactionData.createdAt; // Assuming there is a createdAt field in your transaction data

        let parsedDate;

        if (timestamp) {
          if (typeof timestamp === 'string') {
            // Parse custom string format "6 December 2024 at 00:30:44 UTC+5:30"
            const formattedTimestamp = timestamp.replace(" at ", "T");  // Convert ' at ' to 'T' for ISO format
            parsedDate = new Date(formattedTimestamp); // Convert to Date object
          } else if (timestamp instanceof Date) {
            parsedDate = timestamp; // If it's already a Date object
          } else if (timestamp.toDate) {
            parsedDate = timestamp.toDate(); // Convert Firestore Timestamp to Date
          }
        }

        // Check if the transaction occurred today
        if (parsedDate && parsedDate >= startOfDay && parsedDate <= endOfDay) {
          const hour = parsedDate.getHours(); // Get hour (0-23)
          hourlySalesData[hour] += 1; // Increment the transaction count for the respective hour
        }
      });

      // Format the data for the chart
      const formattedData = hourlySalesData.map((count, index) => ({
        hour: `${index}:00`,  // Format hour as "hour:00"
        salesCount: count
      }));

      setData(formattedData);
    };

    fetchData();
  }, []);

  return (
    <div className='chartt'>
      <h3 className="charttTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={5 / 1}>
        <BarChart data={data}>
          <XAxis dataKey="hour" stroke="#555" />
          <YAxis tickCount={5} />
          <Tooltip />
          <Legend />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
          <Bar dataKey="salesCount" fill="rgba(120,190,32,255)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
