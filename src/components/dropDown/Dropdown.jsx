import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { Link } from 'react-router-dom';



function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  let menuRef = useRef();

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
  });

  return (
    
    <div className="profile-dropdown-container" ref={menuRef}>
      <div className="profile-trigger" onClick={() => setOpen(!open)}>
        <img src="https://as2.ftcdn.net/v2/jpg/02/14/74/61/1000_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg" alt="Profile" />
      </div>

      <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
        <div className='titlesContainer'>
            <label className='name'>Basura Thennakoon<br /><span className='role'>Adminstrator</span></label>
        </div>
        <ul>
          <DropdownItem icons={<AccountCircleOutlinedIcon/>}  text="Profile" />
          <DropdownItem icons={<SettingsOutlinedIcon/>} text2="Settings" />
          <DropdownItem icons={<QuestionMarkOutlinedIcon/>} text="Help" />
          <DropdownItem icons={<LogoutOutlinedIcon/>} text="Logout" />
        </ul>
      </div>
    </div>
  );
}

function DropdownItem(props) {
  return (
    <li className="dropdownItem">
      <div className="dropDownicons">{props.icons}</div>
      <Link to= "./customers">{props.text}</Link>
      <Link to= "./">{props.text2}</Link>
    </li>
  );
}

export default ProfileDropdown;