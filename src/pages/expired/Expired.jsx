import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import  './expired.css';

export default function ExpiredProducts() {
  const [expiredProducts, setExpiredProducts] = useState([]);

  useEffect(() => {
    const fetchExpiredProducts = async () => {
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
        let expiredItems = [];

        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));

          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            const inStockMonth = productData.inStockMonth || {};

            for (const month in inStockMonth) {
              const stockDetails = inStockMonth[month];
              const stockExpireDateStr = stockDetails.stockExpireDate;
              const stockExpireDate = stockExpireDateStr ? new Date(stockExpireDateStr) : null;

              // Include products that have already expired
              if (stockExpireDate && stockExpireDate < today) {
                expiredItems.push({
                  productName: productData.productName,
                  company: productData.company,
                  stockCount: stockDetails.stockCount,
                  stockExpireDate,
                });
              }
            }
          });
        }

        setExpiredProducts(expiredItems);
      } catch (error) {
        console.error('Error fetching expired products: ', error);
      }
    };

    fetchExpiredProducts();
  }, []);

  return (
    <div className='expired'>
      <h2>Expired Products</h2>
      {expiredProducts.length > 0 ? (
        <ul>
          {expiredProducts.map((product, index) => (
            <li key={index}>
              <strong>{product.company} {product.productName}</strong> - 
              {product.stockCount} stock(s) expired on {product.stockExpireDate.toISOString().split('T')[0]}.
            </li>
          ))}
        </ul>
      ) : (
        <p>No expired products found.</p>
      )}
    </div>
  );
}
