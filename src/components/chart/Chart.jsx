import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../../firebase'; // Ensure this is correctly pointing to your firebase.js file
import { collection, getDocs } from 'firebase/firestore';
import './chart.css';

export default function Chart({ title, grid }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);

     
      const monthlyData = Array(12).fill(0);

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const createdAt = userData.createdAt; // This can be a Firestore Timestamp or a string

        let parsedDate;

        if (createdAt) {
          if (createdAt instanceof Date) {
            parsedDate = createdAt; // If it's already a Date object
          } else if (createdAt.toDate) {
            parsedDate = createdAt.toDate(); // Convert Firestore Timestamp to Date
          } else if (typeof createdAt === 'string') {
            // Handle string format and replace " at " with "T" for ISO format
            parsedDate = new Date(createdAt.replace(/ at /, 'T'));
          }
        }

        if (parsedDate && !isNaN(parsedDate.getTime())) { // Check if date is valid
          const month = parsedDate.getMonth(); // Get month index (0-11)
          monthlyData[month] += 1; // Increment the count for the respective month
        }
      });

      // Format the data for the chart
      const formattedData = monthlyData.map((count, index) => ({
        name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, index)),
        activeCustomers: count
      }));

      setData(formattedData);
    };

    fetchData();
  }, []);

  return (
    <div className='chart'>
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#555" />
          <YAxis tickCount={5} />
          <Tooltip />
          <Legend />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
          <Bar dataKey="activeCustomers" fill="rgba(120,190,32,255)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
