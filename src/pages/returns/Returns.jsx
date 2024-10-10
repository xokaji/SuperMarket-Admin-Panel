import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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
        const returnsSnapshot = await getDocs(collection(db, 'returns'));
        const returnsData = returnsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReturns(returnsData);
      } catch (error) {
        console.error('Error fetching returns: ', error);
        toast.error('Error fetching return packages. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

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
            <th>Return ID</th>
            <th>User Name</th>
            <th>Product Name</th>
            <th>Return Reason</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {returns.length > 0 ? (
            returns.map((returnItem) => (
              <tr key={returnItem.id}>
                <td>{returnItem.id}</td>
                <td>{returnItem.userName}</td>
                <td>{returnItem.productName}</td>
                <td>{returnItem.returnReason}</td>
                <td>{new Date(returnItem.returnDate).toLocaleDateString()}</td>
                <td>{returnItem.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-returns">
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
