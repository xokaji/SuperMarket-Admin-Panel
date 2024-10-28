import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
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

        // Fetch current expired products and determine highest sequential ID
        const expiredProductsSnapshot = await getDocs(collection(db, 'expiredProducts'));
        const existingExpired = expiredProductsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const existingIDs = existingExpired.map(exp => parseInt(exp.id)).filter(Number.isInteger);
        const highestID = existingIDs.length > 0 ? Math.max(...existingIDs) : 0;

        let nextID = highestID + 1;

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

              // Check if product is expired and not already saved
              if (stockExpireDate && stockExpireDate < today) {
                const expiredProduct = {
                  productName: productData.productName,
                  company: productData.company,
                  stockCount: stockDetails.stockCount,
                  stockExpireDate: stockExpireDateStr,
                  category,
                };

                const isDuplicate = existingExpired.some(
                  (item) =>
                    item.productName === expiredProduct.productName &&
                    item.company === expiredProduct.company &&
                    item.stockExpireDate === expiredProduct.stockExpireDate
                );

                if (!isDuplicate) {
                  expiredItems.push(expiredProduct);
                  await setDoc(doc(db, 'expiredProducts', nextID.toString()), expiredProduct);
                  nextID++;
                }

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
