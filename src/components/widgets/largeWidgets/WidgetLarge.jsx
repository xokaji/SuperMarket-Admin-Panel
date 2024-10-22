import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Adjust the path as necessary
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import "./widgetLarge.css";

export default function WidgetLarge() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const Button = ({ type }) => {
    return <button className={`widgetLgButton ${type}`}>{type}</button>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query to fetch the 2 most recent transactions
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('date', 'desc'), // Assuming 'date' is a valid field storing the transaction date
          limit(2) // Limit the query to only 2 documents
        );

        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsList = transactionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(transactionsList); // Set only the 2 recent transactions
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Transactions</h3>
      <table className="widgetLgtable">
        <thead>
          <tr className="widgetLgTr">
            <th className="widgetLgth">Customer Name</th>
            <th className="widgetLgth">Date</th>
            <th className="widgetLgth">Amount</th>
            <th className="widgetLgth">Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr className="widgetLgTr" key={transaction.id}>
              <td className="widgetLgUser">
                <span className="widgetlgName">{transaction.name}</span>
              </td>
              <td className="widgetLgDate">{transaction.date}</td>
              <td className="widgetLgAmount">Rs.{transaction.amount}</td>
              <td className="widgetLgMethod"><Button type={transaction.paymentMethod} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
