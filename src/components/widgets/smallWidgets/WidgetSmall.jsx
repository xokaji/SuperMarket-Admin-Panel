import React, { useEffect, useState } from 'react';
import './widgetsmall.css';
import { db } from '../../../firebase'; // Ensure this path is correct
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function WidgetSmall() {
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    const fetchRecentCustomers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'), // Ensure 'createdAt' exists and is a Firestore Timestamp
          limit(2) // Fetch the latest 2 customers
        );
        const querySnapshot = await getDocs(q);
        const customers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentCustomers(customers);
      } catch (error) {
        console.error('Error fetching recent customers:', error);
      }
    };

    fetchRecentCustomers();
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Customers</span>
      
      <ul className="widgetSmList">
        {recentCustomers.map((customer) => (
          <li key={customer.id} className="widgetSmListItem">
            <img src={customer.img || 'https://via.placeholder.com/150'} alt={customer.name} className="widgetSmImg" />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{customer.name}</span>
            </div>
            <button className="widgetSmButton">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
