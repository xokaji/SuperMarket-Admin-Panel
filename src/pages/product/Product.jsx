import React, { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import './product.css';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import ScaleLoader from 'react-spinners/ScaleLoader';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productMonth, setProductMonth]=useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      }
    };
    fetchProduct();
  }, [id]);

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
          <span className="productUpdateTitle">Edit</span>
          
          <form className="productUpdateForm">
            <div className="productUpdateLeft">
              {/* <div className="productUpdateItem">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder={product.productName}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Company</label>
                <input
                  type="text"
                  placeholder={product.company}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Category</label>
                <input
                  type="text"
                  placeholder={product.category}
                  className="productUpdateInput"
                />
              </div> */}
              <div className="productUpdateItem">
                <label>Price</label>
                <input
                  type="text"
                  placeholder={`Rs. ${product.price}`}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Stock</label>
                <input
                  type="text"
                  placeholder={product.stock.toString()}
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
  <label>Product In-Month</label>
  <select
    value={productMonth} // You can add a state for this, e.g., productMonth
    onChange={(e) => setProductMonth(e.target.value)} // Make sure to update the state
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
              <button className="productUpdateButton">Update</button>
            </div>
            
          </form>
        </div>
      </div>
      {/* <Link to="/newProduct" className="productFloatingButton">
        <button className="productFloatingButton">Create</button>
      </Link> */}
    </div>
  );
}
