import React, { useState, useEffect, useRef } from 'react'; 
import './dropdown.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase auth
import { auth } from '../../firebase'; // Adjust path as needed
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

function Dropdown({ profilePicture, adminName }) { // Accept adminName as a prop
  const [open, setOpen] = useState(false);
  let menuRef = useRef();
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const handleLogout = async () => {
    toast.info(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          border: '4px solid rgba(190, 37, 40, 1)',
          borderRadius: '50%',
          borderTop: '4px solid #3498db',
          width: '24px',
          height: '24px',
          marginRight: '10px',
          animation: 'spin 1s linear infinite',
        }}></div>
        <span>Logging out...</span>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  
    // Wait for a short delay to show the spinner
    setTimeout(async () => {
      try {
        await signOut(auth); // Sign out from Firebase
        toast.dismiss(); // Dismiss the toast
        navigate('/'); // Redirect to root path
      } catch (error) {
        toast.error('Error signing out:', { autoClose: 3000 });
        console.error('Error signing out:', error);
      }
    }, 5000); // Adjust the delay as needed (5000ms in this case)
  };
  
  return (
    <div className="profile-dropdown-container" ref={menuRef}>
      <div className="profile-trigger" onClick={() => setOpen(!open)}>
        <img src={profilePicture} alt="Profile" className="profilePicture" /> {/* Use profilePicture prop */}
      </div>

      <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
        <div className='titlesContainer'>
         
            <span className='name'>
              {adminName}<br />
            </span>
            <span className='role'>Administrator</span>
         
        </div>
        <ul>
          <DropdownItem 
            icons={<AccountCircleOutlinedIcon />} 
            text="Profile" 
            link="/profile"  // Added link prop for profile
          />
          {/* <DropdownItem 
            icons={<SettingsOutlinedIcon />} 
            text2="Settings" 
            link="/settings"  // Adjust as needed for settings
          /> */}
          <DropdownItem 
            icons={<QuestionMarkOutlinedIcon />} 
            text="Help" 
            link="/help" // Adjust as needed for help
          />
          <li className="dropdownItem" onClick={handleLogout}>
            <div className="dropDownicons"><LogoutOutlinedIcon /></div>
            <span>Logout</span>
          </li>
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

function DropdownItem({ icons, text, text2, link }) {
  return (
    <li className="dropdownItem">
      <div className="dropDownicons">{icons}</div>
      <Link to={link} className="dropdown-link">{text}</Link> {/* Profile link */}
      {text2 && <Link to={link} className="dropdown-link">{text2}</Link>} {/* Settings link if exists */}
    </li>
  );
}

export default Dropdown;
