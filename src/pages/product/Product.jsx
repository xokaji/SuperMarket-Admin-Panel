import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './product.css';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Product() {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [productMonth, setProductMonth] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [stockCount, setStockCount] = useState('');
  const [totalStock, setTotalStock] = useState(0);
  const [discount, setDiscount] = useState('0');
  const [basePrice, setBasePrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!category || !id) throw new Error('Category or ID is missing');

        const docRef = doc(db, category, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setBasePrice(data.finalPrice);
          updateStockData(data.inStockMonth);
        } else {
          throw new Error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
        toast.error(error.message, { position: 'top-right', autoClose: 3000 });
      }
    };

    const unsubscribe = onSnapshot(doc(db, category, id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct(data);
        setBasePrice(data.finalPrice);
        updateStockData(data.inStockMonth);
      }
    });

    fetchProduct();
    return () => unsubscribe(); // Clean up the listener
  }, [id, category]);

  const updateStockData = (inStockMonth) => {
    let total = 0;
    for (let month in inStockMonth) {
      total += inStockMonth[month].stockCount || 0;
    }
    setTotalStock(total);

    if (productMonth && inStockMonth[productMonth]) {
      setStockCount(inStockMonth[productMonth].stockCount || '');
      setExpiryDate(inStockMonth[productMonth].stockExpireDate ? new Date(inStockMonth[productMonth].stockExpireDate) : null);
    } else {
      setStockCount('');
      setExpiryDate(null);
    }
  };

  useEffect(() => {
    if (discount === '0') {
      setFinalPrice(basePrice);
    } else {
      const discountRate = discount === '5' ? 0.95 : 0.80;
      setFinalPrice((basePrice * discountRate).toFixed(2));
    }
  }, [discount, basePrice]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!finalPrice || !stockCount || !expiryDate || !productMonth) {
      toast.error('Please fill in all the fields before updating.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formattedExpiryDate = expiryDate.toISOString().split('T')[0];

    try {
      const docRef = doc(db, category, id);
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.data();

      const updatedInStockMonth = {
        ...currentData.inStockMonth,
        [productMonth]: {
          stockCount: parseInt(stockCount) || 0,
          stockExpireDate: formattedExpiryDate,
          finalPrice: finalPrice,
        },
      };

      const updatedData = {
        finalPrice: finalPrice,
        inStockMonth: {
          ...updatedInStockMonth,
          totalStock: Object.values(updatedInStockMonth).reduce((acc, month) => acc + (month.stockCount || 0), 0),
        },
      };

      await updateDoc(docRef, updatedData);
      toast.success('Product updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error updating product: ', error);
      toast.error('Error updating product', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!product) {
    return <div className="scalecontainer">Loading...</div>;
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
        <h1 className="productTitle">Product Update Details</h1>
      </div>
      <div className="productContainer">
        <div className="productShow">
          <div className="productShowTop">
            <img src={product.productImage} alt="" className="productShowImg" />
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
              <span className="productShowInfoTitle">Rs. {finalPrice || '0.00'}</span>
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
                  <option value="5">Holiday Discount</option>
                  <option value="20">Seasonal Discount</option>
                </select>
              </div>
              <div className="productUpdateItem">
                <label>Product-In Month</label>
                <select
                  value={productMonth}
                  onChange={(e) => setProductMonth(e.target.value)}
                  className="productUpdateInput"
                >
                  <option value="">Select a Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="productUpdateItem">
                <label>Stock Count</label>
                <input
                  type="number"
                  placeholder={stockCount}
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Expiry Date</label>
                <DatePicker
                  selected={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="productUpdateInput"
                  placeholderText="Select Expiry Date"
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
