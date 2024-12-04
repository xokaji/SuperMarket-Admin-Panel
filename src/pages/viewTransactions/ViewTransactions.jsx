import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase"; // Adjust path as necessary
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify"; // Import toast notifications
import "./viewTransactions.css"; // Ensure your styles are imported
import ScaleLoader from "react-spinners/ScaleLoader";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";

export default function ViewTransactions() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const docRef = doc(db, "transactions", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching transaction: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleConfirm = async () => {
    if (window.confirm("Are you sure you want to confirm this order?")) {
      try {
        if (!transaction || !transaction.items) {
          toast.error("No transaction items to confirm.");
          return;
        }

        // Add transaction items to the "orderedlist" collection
        await addDoc(collection(db, "orderedlist"), {
          transactionId: transaction.id,
          name: transaction.name,
          items: transaction.items, // Items being ordered
          timestamp: new Date(), // Add a timestamp for when the order was confirmed
        });

        toast.success("Order successfully confirmed!");
      } catch (error) {
        console.error("Error confirming order: ", error);
        toast.error("Failed to confirm the order. Please try again.");
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

  if (!transaction) {
    return <div>No transaction found!</div>;
  }

  return (
    <div className="view-transaction-container">
      <div className="transaction-details">
        <h1>Transaction Details</h1>
        <span className="transactionContainerTitle">Transaction Details</span>
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

        <table className="transTable">
          <thead>
            <tr>
              <th className="itemTrans">ITEM</th>
              <th className="itemTrans">QUANTITY COUNT</th>
              <th className="itemTrans">QUANTITY TYPE</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items &&
              transaction.items.map((item, index) => (
                <tr key={index} className="tr">
                  <td className="itemTrans2">{item.name}</td>
                  <td className="itemTrans2">{item.quantity}</td>
                  <td className="itemTrans2">{item.quantityType}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="confirmButtonn">
          <button className="confirmButton" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
