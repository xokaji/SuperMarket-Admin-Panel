import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path based on your project structure
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for alerts

export default function StockLevel() {
  const [lowestStockProduct, setLowestStockProduct] = useState(null);

  const checkStockLevels = async () => {
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

    try {
      for (const category of categories) {
        const productCollection = collection(db, category);
        const productSnapshot = await getDocs(productCollection);
        const products = productSnapshot.docs.map((doc) => doc.data());

        products.forEach((product) => {
          const inStockMonth = product.inStockMonth || {};
          const productLowestStock = Math.min(
            ...Object.values(inStockMonth).map((details) => details?.stockCount || Infinity)
          );

          // Check if stock is below 10
          if (productLowestStock < 5 && productLowestStock !== Infinity) {
            // Check if it's the lowest we've found
            if (productLowestStock < lowestStock) {
              lowestStock = productLowestStock;
              lowestStockDetails = {
                productName: product.productName,
                lowestStock: productLowestStock,
                category: category,
                quantityType: product.quantityType,
              };
            }

            // Notify about the low stock
            toast.warning(`${product.productName} has only ${productLowestStock} units left in ${category}!`, { autoClose: 2500 });
          }
        });
      }

      // Set the state after processing all products
      if (lowestStockDetails) {
        setLowestStockProduct(lowestStockDetails);
      } else {
        setLowestStockProduct(null); // No product with stock below 10
      }
    } catch (error) {
      console.error('Error checking stock levels: ', error);
    }
  };

  useEffect(() => {
    checkStockLevels();
  }, []); // Run once on component mount

  return (
    <div className="stocks3">
      {lowestStockProduct ? (
        <p>
          {lowestStockProduct.productName} {lowestStockProduct.quantityType} has only {lowestStockProduct.lowestStock} left in {lowestStockProduct.category}!
        </p>
      ) : (
        <p>All products have sufficient stocks.</p>
      )}
    </div>
  );
}
