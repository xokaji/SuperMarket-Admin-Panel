import React from 'react';
import './sidebar.css';
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
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        
        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Dashboard</h3>
          <ul className='sidebarList'>
            <li className={`sidebarListItem ${location.pathname === '/' ? 'active' : ''}`}>
              <Link to="/home" className="sidebarLink">
                <HomeOutlinedIcon className='sidebarIcon'/>
                Home
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/analytics' ? 'active' : ''}`}>
              <Link to="/analytics" className="sidebarLink">
                <AnalyticsOutlinedIcon className='sidebarIcon'/>
                Analytics
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/sales' ? 'active' : ''}`}>
              <Link to="/sales" className="sidebarLink">
                <TrendingUpOutlinedIcon className='sidebarIcon'/>
                Sales
              </Link>
            </li>
          </ul>
        </div>

        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Quick Menu</h3>
          <ul className='sidebarList'>
            <li className={`sidebarListItem ${location.pathname === '/customers' ? 'active' : ''}`}>
              <Link to="/customers" className="sidebarLink">
                <PersonOutlineOutlinedIcon className='sidebarIcon'/>
                Customers
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/products' ? 'active' : ''}`}>
              <Link to="/products" className="sidebarLink">
                <Inventory2OutlinedIcon className='sidebarIcon'/>
                Products
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/transactions' ? 'active' : ''}`}>
              <Link to="/transactions" className="sidebarLink">
                <PaidOutlinedIcon className='sidebarIcon'/>
                Transactions
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/reports' ? 'active' : ''}`}>
              <Link to="/reports" className="sidebarLink">
                <BarChartOutlinedIcon className='sidebarIcon'/>
                Reports
              </Link>
            </li>
          </ul>
        </div>

        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Notifications</h3>
          <ul className='sidebarList'>
            <li className={`sidebarListItem ${location.pathname === '/mails' ? 'active' : ''}`}>
              <Link to="/mails" className="sidebarLink">
                <EmailOutlinedIcon className='sidebarIcon'/>
                Mails
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/feedbacks' ? 'active' : ''}`}>
              <Link to="/feedbacks" className="sidebarLink">
                <LibraryBooksOutlinedIcon className='sidebarIcon'/>
                Feedbacks
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/messages' ? 'active' : ''}`}>
              <Link to="/messages" className="sidebarLink">
                <ForumOutlinedIcon className='sidebarIcon'/>
                Messages
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
