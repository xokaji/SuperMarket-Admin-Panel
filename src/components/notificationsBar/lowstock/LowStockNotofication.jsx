import React from 'react';

const LowStockNotification = ({ lowStockProducts }) => {
  return (
    <div>
      {lowStockProducts.length > 0 ? (
        lowStockProducts.map((product, index) => (
          <div key={index}>
            {product.productName} has only {product.lowestStock} units left in {product.category}!
          </div>
        ))
      ) : (
        <div>All products have sufficient stocks.</div>
      )}
    </div>
  );
};

export default LowStockNotification;
