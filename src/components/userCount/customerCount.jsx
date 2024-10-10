import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path based on your project structure
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for alerts
import './customerCount.css'; // Adjust the path based on your project structure

export default function CustomerCount() {
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const customerCollection = collection(db, 'users'); // Adjust collection name if needed
        const customerSnapshot = await getDocs(customerCollection);
        const count = customerSnapshot.docs.length; // Get the count of registered customers
        setCustomerCount(count);
      } catch (error) {
        console.error('Error fetching customer count: ', error);
        toast.error('Failed to fetch customer count.', { autoClose: 2500 });
      }
    };

    fetchCustomerCount();
  }, []);

  return (
    <div className="customer-count" >
      {customerCount}
    </div>
  );
}
