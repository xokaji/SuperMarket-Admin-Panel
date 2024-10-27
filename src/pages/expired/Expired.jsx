import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
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
                  id: docSnapshot.id, // Store the document ID for easy deletion
                  productName: productData.productName || "Unknown Product",
                  company: productData.company || "Unknown Company",
                  stockCount: stockDetails.stockCount || 0,
                  stockExpireDate: stockExpireDateStr,
                  category,
                };

                newExpiredItems.push(expiredProduct);

                // Add to Firestore only if it's not already in the expiredProducts collection
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

        // Update state with new expired products
        setExpiredProducts((prevExpiredProducts) => [
          ...prevExpiredProducts,
          ...newExpiredItems,
        ]);
      } catch (error) {
        console.error('Error fetching or updating expired products: ', error);
      }
    };

    // Initial fetch of expired products
    fetchExpiredProducts();

    // Fetch and handle any newly expired products
    fetchAndHandleExpiredProducts();
  }, []);

  const deleteExpiredProduct = async (id) => {
    try {
      // Delete the product from Firestore
      await deleteDoc(doc(db, 'expiredProducts', id));
      // Update state to remove the deleted product
      setExpiredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error('Error deleting expired product: ', error);
    }
  };

  return (
    <div className='expired'>
      <h2>Expired Products</h2>
      {expiredProducts.length > 0 ? (
        <ul>
          {expiredProducts.map((product, index) => (
            <li key={product.id}>
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
