import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './alert.css';
import ScaleLoader from 'react-spinners/ScaleLoader';

export default function ExpiringProductsAlert() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExpiringProducts = async () => {
      setLoading(true);
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

        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30); // 30 days from today

        const expiringProducts = [];

        // Loop through each category to fetch products
        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));
          console.log(`Category: ${category}, Products Count: ${productsSnapshot.docs.length}`);

          // Loop through each product in the category
          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            console.log("Product Data:", productData); // Debugging line
            const inStockMonth = productData.inStockMonth || {};

            // Loop through each month in inStockMonth
            for (const month in inStockMonth) {
              const stockDetails = inStockMonth[month];
              const stockExpireDateStr = stockDetails.stockExpireDate; // String in "YYYY-MM-DD" format
              const stockExpireDate = stockExpireDateStr ? new Date(stockExpireDateStr) : null;

              // Check if the stockExpireDate is within the next 30 days (including today)
              if (stockExpireDate && stockExpireDate >= today && stockExpireDate <= thirtyDaysFromNow) {
                console.log(`Adding expiring product: ${productData.productName}, Expiry Date: ${stockExpireDate}`); // Debugging line
                const currentYear = new Date().getFullYear();
                expiringProducts.push({
                  productName: productData.productName,
                  category: category,
                  stockCount: stockDetails.stockCount,
                  companyName: productData.companyName,
                  quantityType: productData.quantityType,
                  stockExpireDate,
                  inStockMonth: `${month} ${currentYear}`,
                });
              }
            }
          });
        }

        // Set the alerts state with the filtered expiring products
        setAlerts(expiringProducts);
      } catch (error) {
        console.error('Error checking expiring products: ', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    checkExpiringProducts();
  }, []);

  return (
    <div className="alert-container">
      <h2>Expiring Products Details</h2>
      {loading ? (
        <div className="spinner-container">
          <ScaleLoader color="#3bb077" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="alert-message">No products expiring in the next 30 days.</div>
      ) : (
        <table className="alert-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Company</th>
              <th>Category</th>
              <th>Quantity Type</th>
              <th>In Stock Month</th>
              <th>Expiry Date</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index}>
                <td>{alert.productName}</td>
                <td>{alert.companyName}</td>
                <td>{alert.category}</td>
                <td>{alert.quantityType}</td>
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
