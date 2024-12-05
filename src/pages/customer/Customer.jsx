import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "./customer.css";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function Customer() {
  const { id } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCustomerData(docSnap.data());
        } else {
          setCustomerData({});
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerData({});
      }
    };

    const fetchCartItems = async () => {
      try {
        const q = query(collection(db, "cart"), where("userID", "==", id));
        const querySnapshot = await getDocs(q);
        const carts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            items: data.items,
          };
        });

        if (carts.length > 0) {
          setCartItems(carts[0].items); // Assuming one cart per user
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      }
    };

    const fetchTransactions = async () => {
      try {
        const q = query(collection(db, "transactions"), where("userId", "==", id));
        const querySnapshot = await getDocs(q);

        const fetchedTransactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
      fetchCartItems();
      fetchTransactions();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="scalecontainer">
        <ScaleLoader color="#3bb077" className="scale" />
      </div>
    );
  }

  const membershipClass = customerData.membership === 'Active' ? 'membership-active' : 'membership-inactive';

  return (
    <div className="customer">
      <div className="customerTitleContainer">
        <h1 className="customerTitle">Customer Bio</h1>
      </div>
      <div className="customerContainer">
        <div className="customerShow">
          <div className="customerShowTop">
            <img src={customerData.img} className="customerImage" alt="customer" />
            <div className="customerShowTopTitle">
              <span className="customerShowUsername">{customerData.name}</span>
              <span className="customerShowUserTitle">{customerData.email}</span>
            </div>
          </div>
          <div className="customerShowBottom">
            <span className="customerShowTitle">Account Details</span>
            <div className="customerShowInfo">
              <PersonOutlineOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{customerData.name}</span>
            </div>
            <div className="customerShowInfo">
              <CalendarTodayOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{customerData.nic || "N/A"}</span>
            </div>
            <div className="customerShowInfo">
              <PhoneAndroidOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{customerData.phone}</span>
            </div>
            <div className="customerShowInfo">
              <EmailOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{customerData.email}</span>
            </div>
            <div className="customerShowInfo">
              <LocationSearchingOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{customerData.address}</span>
            </div>
            <div className="customerShowInfo">
              <LoyaltyOutlinedIcon className="customerShowIcon" />
              <span className={`customerShowInfoTitle ${membershipClass}`}>
                {customerData.membership} Fresco
              </span>
            </div>
          </div>
        </div>
        <div className="customerUpdate">
          <span className="customerUpdateTitle">Purchase History</span>
          {transactions.length === 0 ? (
            <p>No purchase history found.</p>
          ) : (
            <table className="purchaseHistoryTable">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Products</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.date || "N/A"}</td>
                    <td>Rs.{transaction.amount}</td>
                    <td>
                      {transaction.items.map((item, index) => (
                        <div key={index}>
                          {item.name} ({item.quantity})
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
