import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify'; 
import ScaleLoader from 'react-spinners/ScaleLoader'; 
import './alert2.css'; 

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStockLevels = async () => {
      setLoading(true);
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

      const zeroStockProducts = [];

      try {
        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));
          const products = productsSnapshot.docs.map((doc) => doc.data());

          products.forEach((product) => {
            const inStockMonth = product.inStockMonth || {};
            const totalStock = inStockMonth?.totalStock || 0;

            // Check if total stock is exactly 0
            if (totalStock === 0) {
              toast.error(`${product.productName} is out of stock in total!`, { autoClose: 2500 });
              zeroStockProducts.push({
                productName: product.productName,
                category: category,
                totalStock: totalStock,
              });
            }

            // Check if any monthly stock level is 0
            Object.keys(inStockMonth).forEach((month) => {
              if (month !== 'totalStock') {
                const details = inStockMonth[month];
                const stockCount = details?.stockCount || 0;

                if (stockCount === 0) {
                  toast.error(`${product.productName} is out of stock in ${month}!`, { autoClose: 2500 });
                  zeroStockProducts.push({
                    productName: product.productName,
                    category: category,
                    inStockMonth: month,
                    stockCount: stockCount,
                    quantityType: product.quantityType
                  });
                }
              }
            });
          });
        }

        setLowStockProducts(zeroStockProducts);
      } catch (error) {
        console.error('Error checking stock levels: ', error);
      } finally {
        setLoading(false);
      }
    };

    checkStockLevels();
  }, []);

  return (
    <div className="alert-container2">
      <h2>Out of Stock Details</h2>
      {loading ? (
        <div className="spinner-container">
          <ScaleLoader color="#3bb077" />
        </div>
      ) : lowStockProducts.length > 0 ? (
        <>
          <table className="alert-table2">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>In Stock Month</th>
                <th>Quantity Type</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.inStockMonth || 'Total Stock'}</td>
                  <td>{product.quantityType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className='alert-message'>No products are out of stock.</p>
      )}
    </div>
  );
}
