import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './product.css';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Product() {
  const { id, category } = useParams(); // Get category from URL
  const [product, setProduct] = useState(null);
  const [productMonth, setProductMonth] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [stockCount, setStockCount] = useState(''); // Renamed to stockCount
  const [totalStock, setTotalStock] = useState(0);
  const [discount, setDiscount] = useState('0');
  const [basePrice, setBasePrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Category:', category);
        console.log('ID:', id);

        if (!category || !id) {
          console.error('Category or ID is missing');
          toast.error('Category or ID is missing', { position: 'top-right', autoClose: 3000 });
          return;
        }

        const docRef = doc(db, category, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setBasePrice(data.finalPrice);

          const inStockMonth = data.inStockMonth || {};
          let total = 0;
          for (let month in inStockMonth) {
            total += inStockMonth[month].stockCount || 0;
          }
          setTotalStock(total);

          if (productMonth && inStockMonth[productMonth]) {
            setStockCount(inStockMonth[productMonth].stockCount || ''); // Updated to stockCount
            setExpiryDate(inStockMonth[productMonth].stockExpireDate ? new Date(inStockMonth[productMonth].stockExpireDate) : null);
          } else {
            setStockCount(''); // Updated to stockCount
            setExpiryDate(null);
          }
        } else {
          console.log('No such document!');
          toast.error('Product not found', { position: 'top-right', autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
        toast.error('Error fetching product details', { position: 'top-right', autoClose: 3000 });
      }
    };

    fetchProduct();
  }, [id, category, productMonth]);

  useEffect(() => {
    if (discount === '0') {
      setFinalPrice(basePrice);
    } else if (discount === '5') {
      setFinalPrice((basePrice * 0.95).toFixed(2));
    } else if (discount === '20') {
      setFinalPrice((basePrice * 0.80).toFixed(2));
    }
  }, [discount, basePrice]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!finalPrice || !stockCount || !expiryDate || !productMonth) { // Updated to stockCount
      toast.error('Please fill in all the fields before updating.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    const formattedExpiryDate = expiryDate ? expiryDate.toISOString().split('T')[0] : null;

    try {
      const docRef = doc(db, category, id);
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.data();

      const updatedInStockMonth = {
        ...currentData.inStockMonth,
        [productMonth]: {
          stockCount: parseInt(stockCount) || 0, // Updated to stockCount
          stockExpireDate: formattedExpiryDate,
          finalPrice: finalPrice,
        },
      };

      const updatedData = {
        finalPrice: finalPrice,
        inStockMonth: updatedInStockMonth,
      };

      await updateDoc(docRef, updatedData);

      toast.success('Product updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      let total = 0;
      for (let month in updatedInStockMonth) {
        total += updatedInStockMonth[month].stockCount || 0;
      }
      setTotalStock(total);
    } catch (error) {
      console.error('Error updating product: ', error);
      toast.error('Error updating product', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  if (!product) {
    return (
      <div className="scalecontainer">
        <div>Loading...</div>
      </div>
    );
  }

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="product">
      <ToastContainer />
      <div className="productTitleContainer">
        <h1 className="productTitle">Product Details</h1>
      </div>
      <div className="productContainer">
        <div className="productShow">
          <div className="productShowTop">
            <img
              src={product.productImage}
              alt=""
              className="productShowImg"
            />
            <div className="productShowTopTitle">
              <span className="productShowName">{product.productName}</span>
              <span className="productShowCompany">{product.company}</span>
            </div>
          </div>
          <div className="productShowBottom">
            <span className="productShowTitle">Product Details</span>
            <div className="productShowInfo">
              <FastfoodOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">{product.productName}</span>
            </div>
            <div className="productShowInfo">
              <CategoryOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">{product.productCategory}</span>
            </div>
            <div className="productShowInfo">
              <ApartmentOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">{product.company}</span>
            </div>
            <div className="productShowInfo">
              <AttachMoneyOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">Rs. {finalPrice ? finalPrice : '0.00'}</span>
            </div>
            <div className="productShowInfo">
              <Inventory2OutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">Total Stock: {totalStock}</span>
            </div>
          </div>
        </div>

        <div className="productUpdate">
          <span className="edittitle">Edit</span>
          <form className="productUpdateForm" onSubmit={handleUpdate}>
            <div className="productUpdateLeft">
              <div className="productUpdateItem">
                <label>Base Price</label>
                <input
                  type="text"
                  placeholder={`Rs. ${basePrice}`}
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Discount (%)</label>
                <select
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="productUpdateInput"
                >
                  <option value="0">No Discount</option>
                  <option value="5">Holiday Discount (5%)</option>
                  <option value="20">Seasonal Discount (20%)</option>
                </select>
              </div>
              <div className="productUpdateItem">
                <label>Final Price</label>
                <input
                  type="text"
                  placeholder={`Rs. ${finalPrice}`}
                  value={finalPrice}
                  readOnly
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Product-In Month</label>
                <select
                  value={productMonth}
                  onChange={(e) => setProductMonth(e.target.value)}
                  className="productUpdateInput"
                >
                  <option value="">Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="productUpdateItem">
                <label>Stock Count</label>
                <input
                  type="text"
                  placeholder="Stock"
                  value={stockCount} // Updated to stockCount
                  onChange={(e) => setStockCount(e.target.value)} // Updated to stockCount
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Expiry Date</label>
                <DatePicker
                  selected={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                  className="productUpdateInput"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select expiry date"
                  filterDate={(date) => date >= new Date()} // Disable past dates
                />
              </div>
            </div>
            <div className="productUpdateRight">
              <button className="productUpdateButton" type="submit">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
