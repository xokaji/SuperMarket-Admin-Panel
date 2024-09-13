import React, { useState, useEffect } from 'react';
import './frozen.css'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import { productData4, productCompanies4 } from '../../../dummyData';

const Frozen = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const products = Object.keys(productData4);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    if (selectedProduct) {
      setSelectedCompany(productCompanies4[selectedProduct][0]);
    }
  }, [selectedProduct]);

  const handleProductSelect = (event) => {
    const product = event.target.value;
    setSelectedProduct(product);
    if (product) {
      setSelectedCompany(productCompanies4[product][0]);
    }
  };

  const handleMonthSelect = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCompanySelect = (event) => {
    setSelectedCompany(event.target.value);
  };

  const filteredData = selectedProduct
    ? productData4[selectedProduct].filter((data) => !selectedMonth || data.month === selectedMonth)
    : [];

  return (
    <div className="grocery-container">
      <h1 className="title">Frozen Products Stock</h1>
      <div className="grocery-viewer">
     
        <div className="select-container">
          <label htmlFor="product-select">Choose a Product:</label>
          <select id="product-select" value={selectedProduct} onChange={handleProductSelect}>
            <option value="">Select a Frozen Product</option>
            {products.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

   
        <div className="select-container">
          <label htmlFor="company-select">Related Company:</label>
          <select id="company-select" value={selectedCompany} onChange={handleCompanySelect}>
            {selectedProduct && productCompanies4[selectedProduct].map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
        

       
        <div className="select-container">
          <label htmlFor="month-select">Choose a Month:</label>
          <select id="month-select" value={selectedMonth} onChange={handleMonthSelect}>
            <option value="">All the Year</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      
      {selectedProduct && (
        <div className="chart-container">
          <h2>Stocks for {selectedProduct} ({selectedCompany})</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stocks" fill="#8884d8" /> 
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Frozen;

