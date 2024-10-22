import React, { useEffect, useState } from 'react';
import { db } from "../../firebase" // Adjust the import based on your firebase setup
import { collection, getDocs } from 'firebase/firestore';
import './orders.css'; // Importing the CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (err) {
        setError('Error fetching orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      {loading && <p className="loading-message">Loading orders...</p>}
      {error && <p className="error-message">{error}</p>}
      {orders.length === 0 && !loading && (
        <p className="no-orders">No orders available</p>
      )}
      {orders.length > 0 && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{Array.isArray(order.products) ? order.products.join(', ') : 'N/A'}</td>
          
                <td>{order.status}</td>
                <td>
                  <button className="btn-update">Update</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
