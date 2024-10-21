import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path as necessary
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersList = await Promise.all(
          ordersSnapshot.docs.map(async (docSnapshot) => {
            const orderData = docSnapshot.data();
            const userDocRef = doc(db, "users", docSnapshot.id); // Use the same ID to fetch user data
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
              console.error(`User with ID ${docSnapshot.id} not found.`);
              return {
                id: docSnapshot.id,
                customerName: "Unknown User", // Fallback if user not found
                items: [], // Set to empty array to prevent errors
                totalAmount: 0, // Fallback for totalAmount
                ...orderData,
              };
            }

            const userData = userDoc.data();
            console.log("Fetched user data: ", userData); // Log user data
            
            return {
              id: docSnapshot.id,
              customerName: `${userData.fname || ""} ${userData.lname || ""}`, // Combining first and last names
              items: orderData.items || [], // Ensure items is an array, default to empty
              totalAmount: typeof orderData.totalAmount === 'number' ? orderData.totalAmount : 0, // Ensure totalAmount is a number
              ...orderData,
            };
          })
        );
        console.log("Orders List: ", ordersList); // Log the final orders list
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, "orders", orderId); // Reference to the order document
      await updateDoc(orderDocRef, { status: newStatus }); // Update the status in Firestore
      console.log(`Order ${orderId} marked as ${newStatus}`);
      
      // Update local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  return (
    <div className="orders-container">
      <h1 className="orders-title">Customer Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Items</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.Name}</td>
                <td>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} (x{item.quantity})
                      </div>
                    ))
                  ) : (
                    <div>No items found</div> // Fallback for empty or non-array items
                  )}
                </td>
                                <td className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </td>
                <td>
                  <button className="action-btn view-btn">View</button>
                  <button
                    className="action-btn ready-btn"
                    onClick={() => handleStatusUpdate(order.id, "ready")}
                  >
                    Mark Ready
                  </button>
                  <button
                    className="action-btn delivering-btn"
                    onClick={() => handleStatusUpdate(order.id, "delivering")}
                  >
                    Mark Delivering
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr> 
              <td colSpan="6" style={{ textAlign: "center" }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
