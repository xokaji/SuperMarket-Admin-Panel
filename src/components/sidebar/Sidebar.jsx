import React from 'react'
import './sidebar.css'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';


export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Dashboard</h3>
          <ul className='sidebarList'>

            <li className='sidebarListItem active'>
              <HomeOutlinedIcon className='sidebarIcon'/>
              Home
            </li>

            <li className='sidebarListItem'>
              <AnalyticsOutlinedIcon className='sidebarIcon'/>
              Analytics
            </li>

            <li className='sidebarListItem'>
              <TrendingUpOutlinedIcon className='sidebarIcon'/>
              Sales
            </li>

          </ul>
        </div>

        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Quick Menu</h3>
          <ul className='sidebarList'>

            <li className='sidebarListItem'>
              <PersonOutlineOutlinedIcon className='sidebarIcon'/>
              Customers
            </li>

            <li className='sidebarListItem'>
              <Inventory2OutlinedIcon className='sidebarIcon'/>
              Products
            </li>

            <li className='sidebarListItem'>
              <PaidOutlinedIcon className='sidebarIcon'/>
              Transactions
            </li>

            <li className='sidebarListItem'>
              <BarChartOutlinedIcon className='sidebarIcon'/>
              Reports
            </li>

          </ul>
        </div>

        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Notifications</h3>
          <ul className='sidebarList'>

            <li className='sidebarListItem'>
              <EmailOutlinedIcon className='sidebarIcon'/>
              Mails
            </li>

            <li className='sidebarListItem'>
              <LibraryBooksOutlinedIcon className='sidebarIcon'/>
              Feedbacks
            </li>

            <li className='sidebarListItem'>
              <ForumOutlinedIcon className='sidebarIcon'/>
              Messages
            </li>

          </ul>
        </div>
        
      </div>
    </div>
  )
}
