import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function ExpiringProductsAlert() {
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const checkExpiringProducts = async () => {
      try {
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

        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        let closestExpiringProduct = null;
        let closestExpirationDate = null;

        const expiringProducts = [];

        for (const category of categories) {
          const productsSnapshot = await getDocs(collection(db, category));

          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            const inStockMonth = productData.inStockMonth || {};

            for (const month in inStockMonth) {
              const stockDetails = inStockMonth[month];
              const stockExpireDateStr = stockDetails.stockExpireDate;
              const stockExpireDate = stockExpireDateStr ? new Date(stockExpireDateStr) : null;

              // Only include products that are expiring within the next 30 days and are not expired
              if (
                stockExpireDate &&
                stockExpireDate >= today && // Not expired
                stockExpireDate <= thirtyDaysFromNow // Expiring within 30 days
              ) {
                expiringProducts.push({
                  productName: productData.productName,
                  company: productData.company,
                  stockCount: stockDetails.stockCount,
                  stockExpireDate,
                });
              }
            }
          });
        }

        // Find the closest expiring product
        expiringProducts.forEach((product) => {
          const { stockExpireDate } = product;
          if (!closestExpirationDate || stockExpireDate < closestExpirationDate) {
            closestExpirationDate = stockExpireDate;
            closestExpiringProduct = product;
          }
        });

        // Set the alert message based on the closest expiring product
        if (closestExpiringProduct) {
          const formattedDate = closestExpiringProduct.stockExpireDate.toISOString().split('T')[0];
          setAlertMessage(
            `${closestExpiringProduct.company} ${closestExpiringProduct.productName} has ${closestExpiringProduct.stockCount} stock(s) expiring on ${formattedDate}.`
          );
        } else {
          setAlertMessage('No products expiring within the next 30 days.');
        }

      } catch (error) {
        console.error('Error checking expiring products: ', error);
        setAlertMessage('Error checking expiring products.');
      }
    };

    checkExpiringProducts();
  }, []);

  return (
    <div>
      <div className="alert-message3">
        {alertMessage}
      </div>
    </div>
  );
}
