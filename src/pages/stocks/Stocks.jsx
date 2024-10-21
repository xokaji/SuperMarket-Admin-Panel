import React, { useEffect, useState, useRef } from 'react';
import DateTimeComponent from '../../components/dateNtime/DateTimeComponent';
import GreetingComponent from '../../components/greeting/GreetingComponent';
import './stocks.css';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

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

const Stock = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [stockInfo, setStockInfo] = useState(null);
  const [adminData, setAdminData] = useState(null); // State for admin data

  const pdfRef = useRef();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminSnapshot = await getDocs(collection(db, 'admin')); // Assuming you have an 'admin' collection
        const adminData = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAdminData(adminData[0]); // Assuming you want the first admin's data
      } catch (error) {
        console.error('Error fetching admin data: ', error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const returnsSnapshot = await getDocs(collection(db, 'returns'));
        // Use returnsData if necessary
      } catch (error) {
        console.error('Error fetching returns: ', error);
        toast.error('Error fetching stock data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
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
          company: doc.data().company,
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies: ', error.message);
        toast.error('Error fetching company data. Please try again.');
      }
    };

    fetchCompanies();
  }, [selectedCategory, selectedProduct]);

  const handleSearch = async () => {
    if (!selectedCategory || !selectedProduct || !selectedCompany) {
      toast.error('Please select all options.');
      return;
    }
  
    try {
      const productSnapshot = await getDocs(collection(db, selectedCategory));
      const productDetailsData = productSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((product) => product.company === selectedCompany);
  
      if (productDetailsData.length === 0) {
        toast.error('No products found for the selected company.');
        setProductDetails(null);
        setStockInfo([]);
        return;
      }
  
      const product = productDetailsData[0];
      
      // Fetch stock information and filter based on stockCount
      const stockInfo = product.inStockMonth
        ? Object.entries(product.inStockMonth)
            .map(([month, stockData]) => ({
              month,
              stockCount: stockData.stockCount, // Keep stockCount
              stockExpireDate: stockData.stockExpireDate, // Keep stockExpireDate
            }))
            .filter(stock => stock.stockCount > 0) // Filter months where stockCount > 0
        : [];
  
      setProductDetails(product);
      setStockInfo(stockInfo);
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

  const barData = {
    labels: stockInfo?.map(stock => stock.month) || [],
    datasets: [
      {
        label: 'Stock Count',
        data: stockInfo?.map(stock => stock.stockCount) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="stock-container" ref={pdfRef}>
      <header className="header">
        {adminData && (
          <GreetingComponent name={`${adminData.fname} ${adminData.lname}`} /> // Pass admin's name
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
            setStockInfo(null);
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
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setSelectedCompany('');
            setProductDetails(null);
            setStockInfo(null);
          }}
          value={selectedProduct}
        >
          <option>Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.productName}>
              {product.productName}
            </option>
          ))}
        </select>

        <select
          className="select-company"
          onChange={(e) => setSelectedCompany(e.target.value)}
          value={selectedCompany}
        >
          <option>Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.company}>
              {company.company}
            </option>
          ))}
        </select>

        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {productDetails && stockInfo && stockInfo.length > 0 ? (
        <div>
          <table className="details-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock In Month</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {stockInfo.map((stock, index) => (
                <tr key={index}>
                  <td>{productDetails.productName}</td>
                  <td>{stock.month}</td>
                  <td>{stock.stockCount}</td>
                  <td>{stock.stockExpireDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Bar data={barData} />
          <div className="pdf-button">
            <button className="pdf-button" onClick={generatePDF}>
              Generate PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="no-product-message">
          <p className='no-product-message'>No product details available.</p>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default Stock;
