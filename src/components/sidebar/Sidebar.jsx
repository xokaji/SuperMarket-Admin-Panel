import React, { useState } from 'react';
import './sidebar.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
// import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { Link, useLocation } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

export default function Sidebar() {
  const location = useLocation();
  const [alertsOpen, setAlertsOpen] = useState(false);

  const toggleAlerts = () => {
    setAlertsOpen(!alertsOpen);
  };

  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        
        {/* Dashboard Menu */}
        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Dashboard</h3>
          <ul className='sidebarList'>
            <li className={`sidebarListItem ${location.pathname === '/home' ? 'active' : ''}`}>
              <Link to="/home" className="sidebarLink">
                <HomeOutlinedIcon className='sidebarIcon' />
                Home
              </Link>
            </li>
            {/* <li className={`sidebarListItem ${location.pathname === '/analytics' ? 'active' : ''}`}>
              <Link to="/analytics" className="sidebarLink">
                <AnalyticsOutlinedIcon className='sidebarIcon' />
                Analytics
              </Link>
            </li> */}
            <li className={`sidebarListItem ${location.pathname === '/sales' ? 'active' : ''}`}>
              <Link to="/sales" className="sidebarLink">
                <TrendingUpOutlinedIcon className='sidebarIcon' />
                Sales
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Menu */}
        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Quick Menu</h3>
          <ul className='sidebarList'>
            <li className={`sidebarListItem ${location.pathname === '/customers' ? 'active' : ''}`}>
              <Link to="/customers" className="sidebarLink">
                <PersonOutlineOutlinedIcon className='sidebarIcon' />
                Customers
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/products' ? 'active' : ''}`}>
              <Link to="/products" className="sidebarLink">
                <Inventory2OutlinedIcon className='sidebarIcon' />
                Products
              </Link>
            </li>
            {/* <li className={`sidebarListItem ${location.pathname === '/orders' ? 'active' : ''}`}>
              <Link to="/orders" className="sidebarLink">
                <ShoppingCartOutlinedIcon className='sidebarIcon' />
                Orders
              </Link>
            </li> */}
            <li className={`sidebarListItem ${location.pathname === '/transactions' ? 'active' : ''}`}>
              <Link to="/transactions" className="sidebarLink">
                <PaidOutlinedIcon className='sidebarIcon' />
                Transactions
              </Link>
            </li>
            
            <li className={`sidebarListItem ${location.pathname === '/stockreports' ? 'active' : ''}`}>
              <Link to="/stockreports" className="sidebarLink">
                <BarChartOutlinedIcon className='sidebarIcon' />
                Stock Reports
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/expired' ? 'active' : ''}`}>
              <Link to="/expired" className="sidebarLink">
                <DeleteForeverOutlinedIcon className='sidebarIcon' />
                Expired Items
              </Link>
            </li>
            <li className={`sidebarListItem ${location.pathname === '/returns' ? 'active' : ''}`}>
              <Link to="/returns" className="sidebarLink">
                <ShoppingBagOutlinedIcon className='sidebarIcon' />
                Returns
              </Link>
            </li>
          </ul>
        </div>

     
        <div className='sidebarMenu'>
          <h3 className='sidebarTitle'>Notifications</h3>
          <ul className='sidebarList'>
            <li className={`sidebarListItem ${alertsOpen ? 'acktive' : ''}`}>
              <button className="sideBarButton" onClick={toggleAlerts}>
                <NotificationsActiveOutlinedIcon className='sidebarIcon' />
                Alerts
              </button>
            </li>
            {alertsOpen && (
              <>
                <li className={`sidebarListItem ${location.pathname === '/alerts/expiring' ? 'active' : ''}`}>
                  <Link to="/alerts/expiring" className="sidebarLink">
                    <KeyboardArrowRightIcon className='sidebarIcon2' />
                    Expiring Stocks
                  </Link>
                </li>
                <li className={`sidebarListItem ${location.pathname === '/alerts/low-stock' ? 'active' : ''}`}>
                  <Link to="/alerts/low-stock" className="sidebarLink">
                    <KeyboardArrowRightIcon className='sidebarIcon2' />
                    Low Stocks
                  </Link>
                </li>
              </>
            )}
            <li className={`sidebarListItem ${location.pathname === '/promos' ? 'active' : ''}`}>
              <Link to="/promos" className="sidebarLink">
                <CampaignOutlinedIcon className='sidebarIcon' />
                Fresco & Promos
              </Link>
            </li>

            {/* <li className={`sidebarListItem ${location.pathname === '/emails' ? 'active' : ''}`}>
              <Link to="/emails" className="sidebarLink">
                <MarkEmailReadOutlinedIcon className='sidebarIcon' />
                Emails
              </Link>
            </li> */}
          </ul>
        </div>
        
        

      </div>
    </div>
  );
}
