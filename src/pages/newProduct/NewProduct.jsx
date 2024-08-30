// src/pages/newProduct/newProduct.jsx
import './newproduct.css';
import { useState } from 'react';
import { db } from '../../firebase'; // Ensure the path to firebase.jsx is correct
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function NewProduct() {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    company: '',
    category: '',
    price: '',
    stock: '',
    discount: '',
    size: '',
  });


  // Handle input change
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert('Please enter a category.');
      return;
    }

    try {
      const collectionName = formData.category;
      const stockAsNumber = parseInt(formData.stock, 10);

      await setDoc(doc(db, collectionName, formData.productId), {
        productName: formData.productName,
        company: formData.company,
        price: formData.price,
        stock: stockAsNumber,
        discount: formData.discount,
        size: formData.size,
      });

      alert('Product saved successfully!');
      navigate('/productList'); // Redirect to ProductList after saving
    } catch (error) {
      console.error('Error saving product: ', error);
      alert('Error saving product.');
    }
  };


  return (
    <div className="newProduct">
      <h1 className="newProductTitle">New Product</h1>
      <div className="productBorder">
        <form className="newProductForm" onSubmit={handleSubmit}>
          <div className="newProductItem">
            <label>Product ID</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              placeholder="12345"
              required
            />
          </div>

          <div className="newProductItem">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Chocolate Biscuits"
              required
            />
          </div>

          <div className="newProductItem">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Munchee"
              required
            />
          </div>

          <div className="newProductItem">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Snacks"
              required
            />
          </div>

          <div className="newProductItem">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Rs.120.00"
              required
            />
          </div>

          <div className="newProductItem">
            <label>Stock</label>
            <input
              type="text"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="320"
              required
            />
          </div>

          <div className="newProductItem">
            <label>Discount</label>
            <input
              type="text"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="10%"
            />
          </div>

          <div className="newProductItem">
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="200g"
            />
          </div>

          <div className="newProductButton">
            <button className="newProductButton" type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
