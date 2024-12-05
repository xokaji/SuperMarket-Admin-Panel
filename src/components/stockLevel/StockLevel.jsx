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
        const products = productSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        products.forEach((product) => {
          const inStockMonth = product.inStockMonth || {};
          const totalStock = inStockMonth.totalStock || 0;

          // Check only total stock
          if (totalStock < 15) {
            toast.warning(`${product.productName} has only ${totalStock} units left in total stock!`, { autoClose: 2500 });

            if (totalStock < lowestStock) {
              lowestStock = totalStock;
              lowestStockDetails = {
                productName: product.productName,
                lowestStock: totalStock,
                category: category,
                quantityType: product.quantityType || 'N/A',
                inStockMonth: 'Total Stock',
              };
            }
          }
        });
      }

      // Update state with the product that has the lowest total stock
      setLowestStockProduct(lowestStockDetails);
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
        <div>
   
          <p>
            {lowestStockProduct.productName} {lowestStockProduct.quantityType} has only<strong> {lowestStockProduct.lowestStock}</strong> units left in {lowestStockProduct.category}
          </p>
         
        </div>
      ) : (
        <p>All products have sufficient stocks.</p>
      )}
    </div>
  );
}
