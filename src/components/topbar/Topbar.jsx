import React from 'react'
import './topbar.css'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Dropdown from '../dropDown/Dropdown';
import logoImage from '../../images/newLogo.png'

export default function Topbar() {
  return (
    <div className='topbar'>
        <div className='topbarWrapper'>
            <div className='topLeft'>
                <img src={logoImage} alt="Logo"/>
            </div>
            <div className='topRight'>
                <div className='topBarIconsContainer'>
                    <NotificationsNoneOutlinedIcon />
                    <span className='topIconBadge'>2</span>
                </div>

                <div className='topBarIconsContainer'>
                    <LanguageOutlinedIcon />
                    <span className='topIconBadge'>2</span>
                </div>
                {/* <div className='topBarIconsContainer'>
                    <SettingsOutlinedIcon />
                </div> */}
                <div>
                    <Dropdown />
                </div>
                
                
            </div>
        </div>
    </div>
  )
}
