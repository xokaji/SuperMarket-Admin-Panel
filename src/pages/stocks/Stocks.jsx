import React, { useEffect, useState, useRef } from 'react';
import DateTimeComponent from '../../components/dateNtime/DateTimeComponent';
import GreetingComponent from '../../components/greeting/GreetingComponent';
import './stocks.css';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Stock = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [stockInfo, setStockInfo] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [availableQuantities, setAvailableQuantities] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  const pdfRef = useRef();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminSnapshot = await getDocs(collection(db, 'admin'));
        const adminData = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAdminData(adminData[0]);
      } catch (error) {
        console.error('Error fetching admin data: ', error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      try {
        const productsSnapshot = await getDocs(collection(db, selectedCategory));
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products: ', error);
        toast.error('Error fetching product data. Please try again.');
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!selectedCategory || !selectedProduct) return;
      try {
        const companiesSnapshot = await getDocs(collection(db, selectedCategory));
        const companiesData = companiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          company: doc.data().companyName,
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies: ', error.message);
        toast.error('Error fetching company data. Please try again.');
      }
    };

    fetchCompanies();
  }, [selectedCategory, selectedProduct]);

  const handleProductChange = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setSelectedCompany('');
    setSelectedQuantity('');
    setAvailableCompanies([]);

    const productData = products.filter(product => product.productName === selectedProduct);
    const quantities = [...new Set(productData.map(product => product.quantityType))];
    setAvailableQuantities(quantities);
  };

  const handleQuantityChange = (selectedQuantity) => {
    setSelectedQuantity(selectedQuantity);
    setSelectedCompany('');

    const matchingProduct = products.find(
      product =>
        product.productName === selectedProduct && 
        product.quantityType === selectedQuantity
    );

    if (matchingProduct) {
      setAvailableCompanies([matchingProduct.companyName]);
      setSelectedCompany(matchingProduct.companyName);
    }
  };

  const handleSearch = async () => {
    if (!selectedCategory || !selectedProduct || !selectedCompany) {
      toast.error('Please select all options.');
      return;
    }

    try {
      const productSnapshot = await getDocs(collection(db, selectedCategory));
      const productDetailsData = productSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (product) =>
            product.companyName === selectedCompany &&
            product.productName === selectedProduct &&
            product.quantityType === selectedQuantity
        );

      if (productDetailsData.length === 0) {
        toast.error('No products found for the selected company and quantity.');
        setProductDetails(null);
        setStockInfo([]);
        return;
      }

      const product = productDetailsData[0];
      const stockInfo = product.inStockMonth
        ? Object.entries(product.inStockMonth)
            .map(([month, stockData]) => ({
              month,
              stockCount: stockData.stockCount,
              stockExpireDate: stockData.stockExpireDate,
            }))
            .filter(stock => stock.stockCount > 0) // Filter out stocks with count zero
        : [];

      // Create a complete stockInfo array with all months
      const completeStockInfo = monthOrder.map(month => {
        const stockData = stockInfo.find(stock => stock.month === month);
        return {
          month,
          stockCount: stockData ? stockData.stockCount : 0, // Use existing count or 0
          stockExpireDate: stockData ? stockData.stockExpireDate : null, // Use existing date or null
        };
      });

      setProductDetails(product);
      setStockInfo(completeStockInfo);
    } catch (error) {
      console.error('Error fetching product or stock info: ', error);
      toast.error('Error fetching product or stock information. Please try again.');
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const input = pdfRef.current;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`${productDetails.productName}_StockDetails.pdf`);
  };

  if (loading) {
    return (
      <div className="scalecontainer">
        <ScaleLoader color="#3bb077" className="scale" />
      </div>
    );
  }

  return (
    <div className="stock-container" ref={pdfRef}>
      <header className="header">
        {adminData && (
          <GreetingComponent name={`${adminData.fname} ${adminData.lname}`} />
        )}
        <p className="stockmanagement">Stock Management</p>
        <div className="date">
          <DateTimeComponent />
        </div>
      </header>

      <div className="select-options">
        <select
          className="select-category"
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProduct('');
            setCompanies([]);
            setProductDetails(null);
            setStockInfo([]);
          }}
          value={selectedCategory}
        >
          <option>Main Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <select
          className="select-product"
          onChange={(e) => handleProductChange(e.target.value)}
          value={selectedProduct}
        >
          <option>Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.productName}>
              {product.productName} {product.quantityType}
            </option>
          ))}
        </select>

        <select
          className="select-quantity"
          onChange={(e) => handleQuantityChange(e.target.value)}
          value={selectedQuantity}
        >
          <option>Quantity</option>
          {availableQuantities.map((quantity) => (
            <option key={quantity} value={quantity}>
              {quantity}
            </option>
          ))}
        </select>

        <select
          className="select-company"
          onChange={(e) => setSelectedCompany(e.target.value)}
          value={selectedCompany}
        >
          <option>Company</option>
          {availableCompanies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {productDetails && (
        <div className="product-details">
          <label className='stk'>{productDetails.companyName} {productDetails.productName} {productDetails.quantityType}</label>
          {/* <p>Base Price: {productDetails.price}</p>
          <p>Discount: {productDetails.discount}</p>
          <p>Final Price: {productDetails.finalPrice}</p> */}
        </div>
      )}

{stockInfo.length > 0 && (
  <div>
    <h3>Stock Information</h3>
    <table className="details-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Stock Count</th>
          <th>Expire Date</th>
        </tr>
      </thead>
      <tbody>
        {stockInfo
          .filter(stock => stock.stockCount > 0 && stock.stockExpireDate) // Only include entries with stockCount > 0 and a valid stockExpireDate
          .map((stock, index) => (
            <tr key={index}>
              <td>{stock.month}</td>
              <td>{stock.stockCount}</td>
              <td>{stock.stockExpireDate}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)}


      {stockInfo.length > 0 && (
        <div>
          <h3>Stock Bar Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stockInfo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockCount" fill="#3bb077" />
            </BarChart>
          </ResponsiveContainer>
          <div className="export-btn">
          <button onClick={generatePDF} className='pdf-button-export'>Generate PDF</button>
          </div>
          
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Stock;
