import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase'; // Adjust path as necessary
import { doc, getDoc } from 'firebase/firestore';
import './viewTransactions.css'; // Ensure your styles are imported
import ScaleLoader from 'react-spinners/ScaleLoader';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';

export default function ViewTransactions() {
  const { id } = useParams(); 
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // Fetch the transaction document from Firestore
        const docRef = doc(db, 'transactions', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Set transaction data from Firestore document
          setTransaction({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching transaction: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) {
    return (
      <div className="scalecontainer">
        <ScaleLoader color="#3bb077" className="scale" />
      </div>
    );
  }

  if (!transaction) {
    return <div>No transaction found!</div>;
  }

  return (
    <div className="view-transaction-container">
      <div className="transaction-details">
        <h1>Transaction Details</h1>
        <span className='transactionContainerTitle'>Transaction Details</span>
        <div className="transactionShowInfo">
          <FormatListNumberedOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.id}</span>
        </div>
        <div className="transactionShowInfo">
          <AccountCircleOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.name}</span>
        </div>
        <div className="transactionShowInfo">
          <DateRangeOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.date}</span>
        </div>
        <div className="transactionShowInfo">
          <AccessTimeOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.time}</span>
        </div>
        <div className="transactionShowInfo">
          <AttachMoneyOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.amount}</span>
        </div>
        <div className="transactionShowInfo">
          <ReceiptLongOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.paymentMethod}</span>
        </div>
        <div className="transactionShowInfo">
          <PrivacyTipOutlinedIcon className="transactionShowIcon" />
          <span className="transactionShowInfoTitle">{transaction.paymentStatus}</span>
        </div>
      </div>

      {/* Ordered Items Section */}
      <div className="ordered-items">
        <div className="label">
          <label className="label">Ordered Items</label>
        </div>
        
        <table className='transTable'>
          <thead>
            <tr>
              <th className='itemTrans'>ITEM</th>
              <th className='itemTrans'>QUANTITY</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items && transaction.items.map((item, index) => (
              <tr key={index} className='tr'>
                <td className='itemTrans2'>{item.name}</td>
                <td className='itemTrans2'>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
