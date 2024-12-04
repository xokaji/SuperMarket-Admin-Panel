import React, { useEffect, useState } from 'react';
import './topbar.css';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Dropdown from '../dropDown/Dropdown';
import logoImage from '../../images/logo2.png';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Topbar() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [adminData, setAdminData] = useState({
    profilePicture: '',
    firstName: '',
    lastName: '',
  }); // Define state for admin data

  const checkNotifications = async () => {
    try {
      const categories = [
        'grocery',
        'dairy&eggs',
        'meats&seafoods',
        'frozenfoods',
        'beverages',
        'snacks',
        'bakeryproducts',
        'health&wellness',
      ];

      let lowStockCount = 0;
      let expiringProductsList = [];
      let lowStockProductsList = [];

      // Check low stock levels
      for (const category of categories) {
        const productSnapshot = await getDocs(collection(db, category));
        const products = productSnapshot.docs.map((doc) => doc.data());

        products.forEach((product) => {
          const inStockMonth = product.inStockMonth || {};
          const productLowestStock = Math.min(
            ...Object.values(inStockMonth).map((details) => details?.stockCount || Infinity)
          );

          // Check if stock is below 10
          if (productLowestStock < 10) {
            lowStockCount++;
            lowStockProductsList.push({
              productName: product.productName,
              lowestStock: productLowestStock,
              category: category,
            });
          }
        });
      }

      // Check for expiring products
      const today = new Date();
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      for (const category of categories) {
        const productsSnapshot = await getDocs(collection(db, category));
        productsSnapshot.forEach((doc) => {
          const productData = doc.data();
          const inStockMonth = productData.inStockMonth || {};

          for (const month in inStockMonth) {
            const stockDetails = inStockMonth[month];
            const stockExpireDateStr = stockDetails.stockExpireDate;
            const stockExpireDate = stockExpireDateStr ? new Date(stockExpireDateStr) : null;

            // Check if product is expiring within the next 30 days
            if (stockExpireDate && stockExpireDate >= today && stockExpireDate <= thirtyDaysFromNow) {
              expiringProductsList.push({
                productName: productData.productName,
                company: productData.company,
                stockCount: stockDetails.stockCount,
                stockExpireDate,
              });
            }
          }
        });
      }

      // Update state
      setExpiringProducts(expiringProductsList);
      setLowStockProducts(lowStockProductsList);
      setNotificationCount(lowStockCount + expiringProductsList.length);
    } catch (error) {
      console.error('Error checking notifications: ', error);
    }
  };

  const fetchAdminProfilePicture = async () => {
    try {
      const docRef = doc(db, 'admin', '1'); // Assuming '1' is the admin DocumentID
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const adminData = docSnap.data();
        setAdminData({
          profilePicture: adminData.profilePicture || 'https://via.placeholder.com/150',
          firstName: adminData.fname,
          lastName: adminData.lname,
        }); // Set the firstName and lastName along with profile picture
      }
    } catch (error) {
      console.error('Error fetching admin profile picture:', error);
    }
  };

  useEffect(() => {
    checkNotifications();
    fetchAdminProfilePicture(); // Fetch profile picture on component mount
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
        <div className='topLeft'>
          <img src={logoImage} alt="Logo" className='logoImage' width={200} />
          <span className='logo'>Green</span>
          <span className='logo2'>Mart</span>
        </div>
        <div className='topRight'>
          <div className='notificationWrapper'>
            <div className='notificationIcon' onClick={toggleDropdown}>
              <NotificationsNoneOutlinedIcon />
              {notificationCount > 0 && <span className='redDot' />}
            </div>
            {showDropdown && (
              <div className='notificationMenu'>
                <h4>Notifications</h4>
                {lowStockProducts.map((product, index) => (
                  <div className={`notificationItem low-stock`} key={index}>
                    <p>{product.productName} has only {product.lowestStock} units left in {product.category}!</p>
                  </div>
                ))}
                {expiringProducts.map((product, index) => (
                  <div className={`notificationItem expiring`} key={index}>
                    <p>{product.company} {product.productName} expires on {product.stockExpireDate.toISOString().split('T')[0]}.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* <div className='topBarIconsContainer'>
            <SettingsOutlinedIcon />
          </div> */}
          <div className='profilePictureWrapper'>
            <Dropdown 
              profilePicture={adminData.profilePicture} 
              adminName={`${adminData.firstName} ${adminData.lastName}`} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
