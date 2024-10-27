import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './expired.css';

export default function ExpiredProducts() {
  const [expiredProducts, setExpiredProducts] = useState([]);

  useEffect(() => {
    const fetchAndSaveExpiredProducts = async () => {
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

          for (const docSnapshot of productsSnapshot.docs) {
            const productData = docSnapshot.data();
            const inStockMonth = productData.inStockMonth || {};

            let shouldUpdateDoc = false;

            for (const month in inStockMonth) {
              const stockDetails = inStockMonth[month];
              const stockExpireDateStr = stockDetails.stockExpireDate;
              const stockExpireDate = stockExpireDateStr ? new Date(stockExpireDateStr) : null;

              // Check if the product is expired
              if (stockExpireDate && stockExpireDate < today) {
                const expiredProduct = {
                  productName: productData.productName,
                  company: productData.company,
                  stockCount: stockDetails.stockCount,
                  stockExpireDate: stockExpireDateStr,
                  category,
                };

                expiredItems.push(expiredProduct);

                // Save expired product to Firestore 'expiredProducts' collection
                await addDoc(collection(db, 'expiredProducts'), expiredProduct);

                // Remove expired stock
                delete inStockMonth[month];
                shouldUpdateDoc = true;
              }
            }

            // Update Firestore document if expired stock was removed
            if (shouldUpdateDoc) {
              await updateDoc(doc(db, category, docSnapshot.id), { inStockMonth });
            }
          }
        }

        setExpiredProducts(expiredItems);
      } catch (error) {
        console.error('Error fetching or updating expired products: ', error);
      }
    };

    fetchAndSaveExpiredProducts();
  }, []);

  return (
    <div className='expired'>
      <h2>Expired Products</h2>
      {expiredProducts.length > 0 ? (
        <ul>
          {expiredProducts.map((product, index) => (
            <li key={index}>
              <strong>{product.company} {product.productName}</strong> - 
              {product.stockCount} stock(s) expired on {product.stockExpireDate}.
            </li>
          ))}
        </ul>
      ) : (
        <p>No expired products found.</p>
      )}
    </div>
  );
}
