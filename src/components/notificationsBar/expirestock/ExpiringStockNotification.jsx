import React from 'react';

const ExpiringStockNotification = ({ expiringProducts }) => {
  return (
    <div>
      {expiringProducts.length > 0 ? (
        expiringProducts.map((product, index) => (
          <div key={index}>
            {product.company} {product.productName} expires on {product.stockExpireDate.toISOString().split('T')[0]}.
          </div>
        ))
      ) : (
        <div>No expiring products.</div>
      )}
    </div>
  );
};

export default ExpiringStockNotification;
