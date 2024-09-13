import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./customer.css";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import ScaleLoader from "react-spinners/ScaleLoader";

export default function Customer() {
  const { id } = useParams();
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Document data:", data);
          setCustomerData(data);
        } else {
          console.log("No such document!");
          setCustomerData({});
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setCustomerData({});
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  if (!customerData) {
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
            <img src={customerData.img} className="customerImage" alt="customer"/>
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
          <span className="customerUpdateTitle">View Purchase History</span>
          
        </div>
      </div>
    </div>
  );
}
