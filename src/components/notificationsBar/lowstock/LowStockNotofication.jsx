const LowStockNotification = ({ lowStockProducts = [] }) => {
  return (
    <div>
      {lowStockProducts.length > 0 ? (
        lowStockProducts.map((product, index) => (
          <div key={index}>
            <strong>{product.productName}</strong> in the <strong>{product.category}</strong> category
            {product.inStockMonth ? (
              <>
                {' '} has <strong>{product.stockCount}</strong> units left in <strong>{product.inStockMonth}</strong> stock!
              </>
            ) : (
              <>
                {' '} has only <strong>{product.stockCount}</strong> units left in total stock!
              </>
            )}
          </div>
        ))
      ) : (
        <div>All products have sufficient stocks.</div>
      )}
    </div>
  );
};

export default LowStockNotification;
