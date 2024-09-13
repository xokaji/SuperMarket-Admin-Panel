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
import ScaleLoader from 'react-spinners/ScaleLoader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productMonth, setProductMonth] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setPrice(data.finalPrice);
          setStock(data.stock);

          // Handle expiryDate if it exists
          if (data.expiryDate && data.expiryDate.seconds) {
            setExpiryDate(new Date(data.expiryDate.seconds * 1000));
          } else {
            setExpiryDate(null);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!price || !stock || !expiryDate || !productMonth) {
      // Show error toast if any field is missing
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

    // Format the expiryDate to 'YYYY-MM-DD' if it exists
    const formattedExpiryDate = expiryDate
      ? expiryDate.toISOString().split('T')[0]
      : null;

    const updatedData = {
      finalPrice: price,
      stock: parseInt(stock),
      productMonth,
      expiryDate: formattedExpiryDate, // Use the formatted date
    };

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updatedData);

      // Success Toast
      toast.success('Product updated successfully!', {
        position: "top-right",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error('Error updating product: ', error);

      // Error Toast
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
        <ScaleLoader color="#3bb077" className="scale" />
      </div>
    );
  }

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product Details</h1>
      </div>
      <div className="productContainer">
        <div className="productShow">
          <div className="productShowTop">
            <img
              src="https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/114800--01--1623926473.webp"
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
              <span className="productShowInfoTitle">Rs. {product.finalPrice}</span>
            </div>
            <div className="productShowInfo">
              <Inventory2OutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">{product.stock}</span>
            </div>
          </div>
        </div>
        <div className="productUpdate">
          <span className="edittitle">Edit</span>
          <form className="productUpdateForm" onSubmit={handleUpdate}>
            <div className="productUpdateLeft">
              <div className="productUpdateItem">
                <label>Price</label>
                <input
                  type="text"
                  placeholder={`Rs. ${product.finalPrice}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Stock</label>
                <input
                  type="text"
                  placeholder={product.stock.toString()}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Expiry Date</label>
                <DatePicker
                  selected={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                  className="productUpdateInput"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Expiry Date"
                />
              </div>
              <div className="productUpdateItem">
                <label>Product In-Month</label>
                <select
                  value={productMonth}
                  onChange={(e) => setProductMonth(e.target.value)}
                  className="productUpdateInput"
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>
            <div className="productUpdateRight">
              <button type="submit" className="productUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
