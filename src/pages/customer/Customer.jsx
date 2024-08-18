import { Link } from "react-router-dom";
import "./customer.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationSearchingOutlinedIcon from '@mui/icons-material/LocationSearchingOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';



export default function Customer() {
  return (
    <div className="customer">
      <div className="customerTitleContainer">
        <h1 className="customerTitle">Edit User</h1>
        <Link to="/newCustomer" className="customerAddButton">
          <button className="customerAddButton">Create</button>
        </Link>
      </div>
      <div className="customerContainer">
        <div className="customerShow">
          <div className="customerShowTop">
            <img
              src="https://images.pexels.com/photos/18313465/pexels-photo-18313465/free-photo-of-portrait-of-a-young-man-standing-in-a-desert-with-an-umbrella-in-hand.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="customerShowImg"
            />
            <div className="customerShowTopTitle">
              <span className="customerShowUsername">Anuja Mahagamage</span>
              <span className="customerShowUserTitle">anu69@gmail.comr</span>
            </div>
          </div>
          <div className="customerShowBottom">
            <span className="customerShowTitle">Account Details</span>
            <div className="customerShowInfo">
              <PersonOutlineOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">Anuja Mahagamge</span>
            </div>
            <div className="customerShowInfo">
              <CalendarTodayOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">anuja69@gmail.com</span>
            </div>

            <div className="customerShowInfo">
              <PhoneAndroidOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">+1 123 456 67</span>
            </div>
            <div className="customerShowInfo">
              <EmailOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">annabeck99@gmail.com</span>
            </div>
            <div className="customerShowInfo">
              <LocationSearchingOutlinedIcon className="customerShowIcon" />
              <span className="customerShowInfoTitle">Galle</span>
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
                  placeholder="annabeck99"
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Anuja Mahagage"
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="anuja69@gmail.com"
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="+1 123 456 67"
                  className="customerUpdateInput"
                />
              </div>
              <div className="customerUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Galle"
                  className="customerUpdateInput"
                />
              </div>
            </div>
            <div className="customerUpdateRight">
              <div className="customerUpdateUpload">
                <img
                  className="customerUpdateImg"
                  src="https://images.pexels.com/photos/18313465/pexels-photo-18313465/free-photo-of-portrait-of-a-young-man-standing-in-a-desert-with-an-umbrella-in-hand.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt=""
                />
                <label htmlFor="file">
                  <FileUploadOutlinedIcon className="customerUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="customerUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}