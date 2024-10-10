import React, { useState, useEffect, useRef } from 'react';
import './bakery.css'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import { productData7, productCompanies7 } from '../../../dummyData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Bakery = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const products = Object.keys(productData7);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const chartRef = useRef(null); // Reference to the chart for PDF generation

  useEffect(() => {
    if (selectedProduct) {
      setSelectedCompany(productCompanies7[selectedProduct][0]);
    }
  }, [selectedProduct]);

  const handleProductSelect = (event) => {
    const product = event.target.value;
    setSelectedProduct(product);
    if (product) {
      setSelectedCompany(productCompanies7[product][0]);
    }
  };

  const handleMonthSelect = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCompanySelect = (event) => {
    setSelectedCompany(event.target.value);
  };

  const filteredData = selectedProduct
    ? productData7[selectedProduct].filter((data) => !selectedMonth || data.month === selectedMonth)
    : [];

  const generatePDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.height;
        }

        pdf.save('bakery-stock-report.pdf');
      });
    }
  };

  return (
    <div className="grocery-container">
      <h1 className="title">Bakery Stock</h1>
      <div className="grocery-viewer">
        <div className="select-container">
          <label htmlFor="product-select">Choose a Product:</label>
          <select id="product-select" value={selectedProduct} onChange={handleProductSelect}>
            <option value="">Select a Bakery Product</option>
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
            {selectedProduct && productCompanies7[selectedProduct].map((company, index) => (
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

export default Bakery;
