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

          productsSnapshot.forEach((doc) => {
            const product = doc.data();
            const inStockMonth = product?.inStockMonth || {};
            const totalStock = inStockMonth?.totalStock || 0;

            // Check total stock level
            if (totalStock < 15) {
              if (!zeroStockProducts.find(p => p.productName === product.productName && !p.inStockMonth)) {
                toast.error(`${product.productName} is out of stock in total!`, { autoClose: 2500 });
                zeroStockProducts.push({
                  productName: product.productName,
                  category,
                  totalStock,
                  inStockMonth: null,
                  stockCount: totalStock,
                  quantityType: product.quantityType || 'N/A',
                });
              }
            }

            // Check monthly stock levels
            Object.keys(inStockMonth).forEach((month) => {
              if (month !== 'totalStock') {
                const stockDetails = inStockMonth[month];
                const stockCount = stockDetails?.stockCount || 0;

                if (stockCount === 0) {
                  if (!zeroStockProducts.find(p => p.productName === product.productName && p.inStockMonth === month)) {
                    toast.error(`${product.productName} is out of stock in ${month}!`, { autoClose: 2500 });
                    zeroStockProducts.push({
                      productName: product.productName,
                      category,
                      inStockMonth: month,
                      stockCount,
                      quantityType: product.quantityType || 'N/A',
                    });
                  }
                }
              }
            });
          });
        }

        setLowStockProducts(zeroStockProducts);
      } catch (error) {
        console.error('Error checking stock levels:', error);
      } finally {
        setLoading(false);
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
              {/* <th>In Stock Month</th> */}
              <th>Quantity Type</th>
              <th>Stock Count</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                {/* <td>{product.inStockMonth || 'Total Stock'}</td> */}
                <td>{product.quantityType}</td>
                <td>{product.stockCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="alert-message">No products are low of stock.</p>
      )}
    </div>
  );
}