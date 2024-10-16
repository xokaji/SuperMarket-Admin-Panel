import React, { useState, useEffect } from 'react';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ScaleLoader from 'react-spinners/ScaleLoader';
import './notificationmenu.css'; // Assuming you will style the notification menu here

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notifications (low stock, expiring products)
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);

      // Simulate fetching notifications
      const lowStock = await getLowStockNotifications();
      const expiringProducts = await getExpiringProductNotifications();

      const allNotifications = [...lowStock, ...expiringProducts];
      setNotifications(allNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="notificationWrapper">
      <div className="notificationIcon" onClick={toggleMenu}>
        <NotificationsActiveOutlinedIcon />
        {notifications.length > 0 && <span className="redDot"></span>}
      </div>

      {menuOpen && (
        <div className="notificationMenu">
          <h4>Notifications</h4>
          {loading ? (
            <div className="loader">
              <ScaleLoader color="#36d7b7" />
            </div>
          ) : notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className={`notificationItem ${notification.type}`}>
                  <span className="notificationTitle">{notification.title}</span>
                  <p>{notification.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Simulated function to fetch low stock notifications
async function getLowStockNotifications() {
  // Add your Firebase fetching logic here
  return [
    {
      type: 'low-stock',
      title: 'Low Stock',
      message: 'Product XYZ has only 10 items left.'
    }
  ];
}

// Simulated function to fetch expiring product notifications
async function getExpiringProductNotifications() {
  // Add your Firebase fetching logic here
  return [
    {
      type: 'expiring',
      title: 'Expiring Product',
      message: 'Product ABC will expire in 5 days.'
    }
  ];
}
