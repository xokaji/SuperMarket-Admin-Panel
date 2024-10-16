import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify'; 
import ScaleLoader from 'react-spinners/ScaleLoader'; // Import the spinner
import './alert2.css'; 

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkStockLevels = async () => {
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

        const lowStockProducts = [];

        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));

          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            const inStockMonth = productData.inStockMonth || {};

            // Check for low stock across all months
            Object.values(inStockMonth).forEach((details) => {
              const stockCount = details?.stockCount || 0;

              if (stockCount <= 10) {
                lowStockProducts.push({
                  productName: productData.productName,
                  category: category,
                  inStockMonth: Object.keys(inStockMonth),
                  price: productData.price,
                  stockCount,
                });

                // Alert user if not already alerted for this product
                toast.warning(`${productData.productName} has only ${stockCount} units left!`, { autoClose: 2500 });
              }
            });
          });
        }

        setLowStockProducts(lowStockProducts);
      } catch (error) {
        console.error('Error checking stock levels: ', error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    checkStockLevels();
  }, []);

  return (
    <div className="alert-container2">
      <h2>Low Stock Details</h2>
      {loading ? (
        <div className="spinner-container">
          <ScaleLoader color="#3bb077" />
        </div>
      ) : lowStockProducts.length > 0 ? (
        <table className="alert-table2">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>In Stock Month</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.inStockMonth.join(', ')}</td>
                <td className='tdquantity'>{product.stockCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='alert-message'>All products have sufficient stock.</p>
      )}
    </div>
  );
}
