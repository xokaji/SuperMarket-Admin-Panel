import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./customer.css";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
// import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

export default function Customer() {
  const [user, setUser] = useState(null);
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCustomerData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Please log in to view customer details.</div>;
  }

  return (
    <div className="customer">
      <div className="customerTitleContainer">
        <h1 className="customerTitle">Edit Customer</h1>
        <Link to="/newCustomer" className="customerAddButton">
          <button className="customerAddButton">Create</button>
        </Link>
      </div>
      <div className="customerContainer">
        <div className="customerShow">
          <div className="customerShowTop">
            <div className="customerShowTopTitle">
              <span className="customerShowUsername">{customerData.name}</span> {/* Updated to match Firestore field */}
              <span className="customerShowUserTitle">{user.email}</span>
            </div>
          </div>
          <div className="customerShowBottom">
            <span className="customerShowTitle">Account Details</span>
            <div className="customerShowInfo">
              <PersonOutlineOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{customerData.name}</span> {/* Updated */}
            </div>
            <div className="customerShowInfo">
              <CalendarTodayOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">{user.email}</span>
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
          </div>
        </div>
        <div className="customerUpdate">
          <span className="customerUpdateTitle">Edit</span>
          <form className="customerUpdateForm">
            <div className="customerUpdateLeft">
              <div className="customerUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  placeholder={customerData.username || "Username"}
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder={customerData.name || "Full Name"} 
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder={customerData.email || "Email"}
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder={customerData.phone || "Phone"}
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  placeholder={customerData.address || "Address"}
                  className="customerUpdateInput"
                />
              </div>
            </div>
            <div className="customerUpdateRight">
              <button className="customerUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
