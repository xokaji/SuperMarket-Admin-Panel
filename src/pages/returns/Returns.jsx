import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './returns.css';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const returnsSnapshot = await getDocs(collection(db, 'returnCollection')); // Collection name
        const returnsData = returnsSnapshot.docs.map((doc) => ({
          id: doc.id, // Firestore document ID
          ...doc.data(), // Spread the fields from the document, including transactionId
        }));
        setReturns(returnsData);
      } catch (error) {
        console.error('Error fetching returns: ', error);
        toast.error('Error fetching return packages. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this return?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'returnCollection', id));
        setReturns(returns.filter((returnItem) => returnItem.id !== id));
        toast.success('Return deleted successfully.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } catch (error) {
        console.error('Error deleting return: ', error);
        toast.error('Error deleting return. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="scalecontainer">
        <ScaleLoader color="#3bb077" className="scale" />
      </div>
    );
  }

  return (
    <div className="returns">
      <h2 className="returns-title">Customer Returns</h2>
      <table className="returns-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Item Name</th>
            <th>Price (Rs.)</th>
            <th>Quantity</th>
            <th>Quantity Type</th>
            <th>Return Reason</th>
            <th>Time & Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.length > 0 ? (
            returns.map((returnItem) => (
              <tr key={returnItem.id}>
                <td>{returnItem.transactionId}</td> {/* Displaying transactionId */}
                <td>{returnItem.itemName}</td>
                <td>{returnItem.price}</td>
                <td>{returnItem.quantity}</td>
                <td>{returnItem.quantityType}</td>
                <td>{returnItem.returnReason}</td>
                <td>{new Date(returnItem.timestamp.toDate()).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(returnItem.id)}
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-returns">
                No return packages available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}
