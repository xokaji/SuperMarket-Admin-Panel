import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './expired.css';

export default function Expired() {
  const [expiredProducts, setExpiredProducts] = useState([]);

  useEffect(() => {
    const fetchExpiredProducts = async () => {
      try {
        // Fetch existing expired products from 'expiredProducts' collection
        const expiredProductsSnapshot = await getDocs(collection(db, 'expiredProducts'));
        const existingExpiredItems = expiredProductsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpiredProducts(existingExpiredItems);
      } catch (error) {
        console.error('Error fetching expired products: ', error);
      }
    };

    const fetchAndHandleExpiredProducts = async () => {
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
        let newExpiredItems = [];

        const expiredProductsSnapshot = await getDocs(collection(db, 'expiredProducts'));
        const existingExpired = expiredProductsSnapshot.docs.map((doc) => doc.data());

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
                  productName: productData.productName || "Unknown Product",
                  companyName: productData.companyName || "Unknown Company",
                  stockCount: stockDetails.stockCount || 0,
                  stockExpireDate: stockExpireDateStr,
                  category,
                };

                const isDuplicate = existingExpired.some(
                  (item) =>
                    item.productName === expiredProduct.productName &&
                    item.companyName === expiredProduct.companyName &&
                    item.stockExpireDate === expiredProduct.stockExpireDate
                );

                if (!isDuplicate) {
                  newExpiredItems.push(expiredProduct);
                  const newID = expiredProductsSnapshot.size + newExpiredItems.length;
                  await setDoc(doc(db, 'expiredProducts', newID.toString()), expiredProduct);
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

        // Update state with new expired products
        setExpiredProducts((prevExpiredProducts) => [
          ...prevExpiredProducts,
          ...newExpiredItems,
        ]);
      } catch (error) {
        console.error('Error fetching or updating expired products: ', error);
      }
    };

    fetchExpiredProducts();
    fetchAndHandleExpiredProducts();
  }, []);

  const deleteExpiredProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'expiredProducts', id));
      setExpiredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      console.log(`Product with ID ${id} deleted successfully from Firestore.`);
    } catch (error) {
      console.error('Error deleting expired product from Firestore: ', error);
    }
  };

  return (
    <div className='expired'>
      <h2>Expired Products</h2>
      {expiredProducts.length > 0 ? (
        <ul>
          {expiredProducts.map((product, index) => (
            <li key={`${product.id}-${index}`}>
              <strong>{product.companyName} {product.productName}</strong> - 
              {product.stockCount} stock(s) expired on {product.stockExpireDate}.
              <button
                className="delete-button"
                onClick={() => deleteExpiredProduct(product.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expired products found.</p>
      )}
    </div>
  );
}
