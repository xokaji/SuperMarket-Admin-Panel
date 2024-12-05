import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path based on your project structure
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'; // Add query and orderBy
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for alerts

export default function LatestTransactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchLatestTransactions = async () => {
    try {
      // Reference to the transactions collection
      const transactionsCollection = collection(db, 'transactions');

      // Query to get the latest transactions, ordered by timestamp (descending) and limiting to 5
      const q = query(transactionsCollection, orderBy('timestamp', 'desc'), limit(5)); // Adjust the limit as needed

      const querySnapshot = await getDocs(q);
      const transactionData = querySnapshot.docs.map((doc) => doc.data());

      if (transactionData.length > 0) {
        setTransactions(transactionData); // Set the state with fetched transaction data
      } else {
        toast.info('No transactions found.'); // Show info if no transactions are available
      }
    } catch (error) {
      console.error('Error fetching latest transactions: ', error);
      toast.error('Failed to fetch latest transactions.');
    }
  };

  useEffect(() => {
    fetchLatestTransactions();
  }, []); // Run once on component mount

  return (
    <div className="latest-transactions">
      <h2>Latest Transactions</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
              <p><strong>Customer Name:</strong> {transaction.customerName}</p>
              <p><strong>Total Amount:</strong> {transaction.amount}</p>
              <p><strong>Timestamp:</strong> {new Date(transaction.timestamp.seconds * 1000).toLocaleString()}</p> {/* Convert timestamp to readable format */}
              <h4>Items:</h4>
              <ul>
                {transaction.items && transaction.items.length > 0 ? (
                  transaction.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <p><strong>Item Name:</strong> {item.name}</p>
                      <p><strong>Price:</strong> ${item.price}</p>
                    </li>
                  ))
                ) : (
                  <p>No items available for this transaction.</p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions available.</p>
      )}
    </div>
  );
}
