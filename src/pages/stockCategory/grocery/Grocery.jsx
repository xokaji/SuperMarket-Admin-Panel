import React, { useState, useEffect } from 'react';
import './grocery.css'; 
import { db } from '../../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Grocery = () => {
  const [groceryData, setGroceryData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'grocery'), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroceryData(data);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSearch = () => {
    if (selectedProduct) {
      const productData = groceryData.find(item => item.id === selectedProduct);
      console.log(productData); // Log the product data
      if (productData && Array.isArray(productData.inStockMonth)) {
        const data = productData.inStockMonth.filter((data) => 
          !selectedMonth || data.month === selectedMonth
        );
        setFilteredData(data);
      } else {
        console.error("inStockMonth is not an array", productData);
      }
    }
  };
  

  return (
    <div className="grocery-container">
      <h1 className="title">Grocery Stock</h1>
      
      <div className="grocery-viewer" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="select-container">
          <label htmlFor="product-select">Choose a Product:</label>
          <select id="product-select" value={selectedProduct} onChange={(e) => {
            const product = e.target.value;
            setSelectedProduct(product);
          }}>
            <option value="">Select a Grocery Product</option>
            {groceryData.map((item, index) => (
              <option key={index} value={item.id}>
                {item.id} {/* Assuming the document ID is the product name */}
              </option>
            ))}
          </select>
        </div>

        <div className="select-container">
          <label htmlFor="month-select">Choose a Month:</label>
          <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">All the Year</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {selectedProduct && (
        <div className="data-table-container">
          <h2>Stocks for {selectedProduct}</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Stocks</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>{data.inStockCount}</td> {/* Assuming this field is named inStockCount */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Grocery;
