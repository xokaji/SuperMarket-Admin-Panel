import { Link } from "react-router-dom";
import "./product.css";
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';



export default function Product() {
  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Edit Product</h1>
        <Link to="/newProduct" className="productAddButton">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productContainer">
        <div className="productShow">
          <div className="productShowTop">
            <img
              src='https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/114800--01--1623926473.webp'
              alt=""
              className="productShowImg"
            />
            <div className="productShowTopTitle">
              <span className="productShowName">Chocolate Biscuits</span>
              <span className="productShowCompany">Munchee</span>
            </div>
          </div>
          <div className="productShowBottom">
            <span className="productShowTitle">Product Details</span>
            <div className="productShowInfo">
              <FastfoodOutlinedIcon className="productShowIcon" />
              <span className="productShoInfoTitle">Chocolate Biscuits</span>
            </div>
            <div className="productShowInfo">
              <CategoryOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">Snacks</span>
            </div>
            <div className="productShowInfo">
              <ApartmentOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">Munchee</span>
            </div>
            <div className="productShowInfo">
              <AttachMoneyOutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">Rs. 120.00</span>
            </div>

            <div className="productShowInfo">
              <Inventory2OutlinedIcon className="productShowIcon" />
              <span className="productShowInfoTitle">450</span>
            </div>
            
            
          </div>
        </div>
        <div className="productUpdate">
          <span className="productUpdateTitle">Edit</span>
          <form className="productUpdateForm">
            <div className="productUpdateLeft">

              <div className="productUpdateItem">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Chocolate Buiscuits"
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Company</label>
                <input
                  type="text"
                  placeholder="Muunchee"
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="Snacks"
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Price</label>
                <input
                  type="text"
                  placeholder="Rs. 120.00"
                  className="productUpdateInput"
                />
              </div>
              <div className="productUpdateItem">
                <label>Stock</label>
                <input
                  type="text"
                  placeholder="320"
                  className="productUpdateInput"
                />
              </div>
            </div>
            <div className="productUpdateRight">
              <div className="productUpdateUpload">
                <img
                  className="productUpdateImg"
                  src='https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/114800--01--1623926473.webp'
                  alt=""
                />
                <label htmlFor="file">
                  <FileUploadOutlinedIcon className="productUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="productUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}