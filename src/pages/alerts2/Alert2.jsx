import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify'; 
import ScaleLoader from 'react-spinners/ScaleLoader'; 
import './alert2.css'; 

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowestStockProduct, setLowestStockProduct] = useState(null);

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

      let lowestStock = Infinity;
      let lowestStockDetails = null;
      const lowStockProducts = [];

      try {
        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));
          const products = productsSnapshot.docs.map((doc) => doc.data());

          products.forEach((product) => {
            const inStockMonth = product.inStockMonth || {};
            const totalStock = inStockMonth?.totalStock || 0;

            // Check totalStock first
            if (totalStock <= 10) {
              lowStockProducts.push({
                productName: product.productName,
                category: category,
                totalStock: totalStock,
              });

              toast.warning(`${product.productName} has only ${totalStock} left in total stock!`, { autoClose: 2500 });

              if (totalStock < lowestStock) {
                lowestStock = totalStock;
                lowestStockDetails = {
                  productName: product.productName,
                  lowestStock: totalStock,
                  category: category,
                };
              }
            }

            // Check individual month stock levels
            Object.keys(inStockMonth).forEach((month) => {
              if (month !== 'totalStock') {
                const details = inStockMonth[month];
                const stockCount = details?.stockCount || 0;

                if (stockCount <= 10) {
                  lowStockProducts.push({
                    productName: product.productName,
                    category: category,
                    inStockMonth: month,
                    stockCount: stockCount,
                  });

                  toast.warning(`${product.productName} has only ${stockCount} units left in ${month}!`, { autoClose: 2500 });

                  if (stockCount < lowestStock) {
                    lowestStock = stockCount;
                    lowestStockDetails = {
                      productName: product.productName,
                      lowestStock: stockCount,
                      category: category,
                      month: month,
                    };
                  }
                }
              }
            });
          });
        }

        setLowStockProducts(lowStockProducts);
        if (lowestStockDetails) {
          setLowestStockProduct(lowestStockDetails);
        }
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
      <h2>Low Stock Details</h2>
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
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts
                .filter(product => product.inStockMonth) // Filter for products with monthly stock
                .map((product, index) => (
                  <tr key={index}>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.inStockMonth}</td>
                    <td className='tdquantity'>{product.stockCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className='alert-message'>All products have sufficient stock.</p>
      )}
    </div>
  );
}
