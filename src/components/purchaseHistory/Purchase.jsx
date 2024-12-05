import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust the path based on your project
import { collection, query, where, getDocs } from "firebase/firestore";


const PurchaseHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        const fetchedTransactions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [userId]);

  if (loading) {
    return <div>Loading purchase history...</div>;
  }

  if (transactions.length === 0) {
    return <div>No purchase history found for this customer.</div>;
  }

  return (
    <div className="purchase-history">
      <h2>Purchase History</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} className="transaction-item">
            <p><strong>Date:</strong> {transaction.date}</p>
            <p><strong>Items:</strong> {transaction.items.join(", ")}</p>
            <p><strong>Total Amount:</strong> ${transaction.totalAmount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchaseHistory;
