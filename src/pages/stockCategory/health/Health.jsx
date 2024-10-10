import React, { useState, useEffect, useRef } from 'react';
import './health.css'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import { productData8, productCompanies8 } from '../../../dummyData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Health = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const products = Object.keys(productData8);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const chartRef = useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedCompany(productCompanies8[selectedProduct][0] || '');
    }
  }, [selectedProduct]);

  const handleProductSelect = (event) => {
    const product = event.target.value;
    setSelectedProduct(product);
    setSelectedCompany(product ? productCompanies8[product][0] || '' : '');
  };

  const handleMonthSelect = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCompanySelect = (event) => {
    setSelectedCompany(event.target.value);
  };

  const filteredData = selectedProduct
    ? productData8[selectedProduct].filter((data) => !selectedMonth || data.month === selectedMonth)
    : [];

  const generatePDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('health-wellness-stock-report.pdf');
      });
    }
  };

  return (
    <div className="grocery-container">
      <h1 className="title">Health & Wellness Stock</h1>
      <div className="grocery-viewer">
        <div className="select-container">
          <label htmlFor="product-select">Choose a Product:</label>
          <select id="product-select" value={selectedProduct} onChange={handleProductSelect}>
            <option value="">Select a Health & Wellness Product</option>
            {products.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div className="select-container">
          <label htmlFor="company-select">Related Company:</label>
          <select id="company-select" value={selectedCompany} onChange={handleCompanySelect} disabled={!selectedProduct}>
            {selectedProduct && productCompanies8[selectedProduct].map((company, index) => (
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
        <div className="chart-container" ref={chartRef}>
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

      <div className="buttonPdf">
        <button onClick={generatePDF} className="generate-pdf-button">Generate PDF</button>
      </div>
    </div>
  );
};

export default Health;
