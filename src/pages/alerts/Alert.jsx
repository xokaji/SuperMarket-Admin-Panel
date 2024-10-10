import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './alert.css';
import ScaleLoader from 'react-spinners/ScaleLoader'; // Import the spinner
import './alert.css';

export default function ExpiringProductsAlert() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkExpiringProducts = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const categories = [
          'grocery',
          'dairyeggs',
          'meats&seafoods',
          'frozenfoods',
          'beverages',
          'snacks',
          'bakery',
          'health&wellness',
        ];

        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30); // 30 days from today

        const expiringProducts = [];

        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));

          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            const inStockMonth = productData.inStockMonth || {};

            for (const month in inStockMonth) {
              const stockDetails = inStockMonth[month];
              const stockExpireDateStr = stockDetails.stockExpireDate;
              const stockExpireDate = stockExpireDateStr ? new Date(stockExpireDateStr) : null;

              // Check if the stockExpireDate is within the next 30 days
              if (stockExpireDate && stockExpireDate >= today && stockExpireDate <= thirtyDaysFromNow) {
                const currentYear = new Date().getFullYear(); // Get the current year
                expiringProducts.push({
                  productName: productData.productName,
                  category: category,
                  stockCount: stockDetails.stockCount,
                  stockExpireDate,
                  inStockMonth: `${month} ${currentYear}`, // Add month and year info
                });
              }
            }
          });
        }

        // Set the alerts state
        setAlerts(expiringProducts);
      } catch (error) {
        console.error('Error checking expiring products: ', error);
        setAlerts([]);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    checkExpiringProducts();
  }, []);

  return (
    <div className="alert-container">
      <h2>Expiring Products Alerts</h2>
      {loading ? (
        <div className="spinner-container">
          <ScaleLoader color="#3bb077" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="alert-message">No products expiring within the next 30 days.</div>
      ) : (
        <table className="alert-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>In Stock Month</th>
              <th>Expiry Date</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index}>
                <td>{alert.productName}</td>
                <td>{alert.category}</td>
                <td>{alert.inStockMonth}</td>
                <td className='expiry-date'>{alert.stockExpireDate.toISOString().split('T')[0]}</td>
                <td>{alert.stockCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
