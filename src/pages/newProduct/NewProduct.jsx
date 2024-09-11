import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Make sure the path is correct
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import './newproduct.css';

export default function AddNewProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [company, setCompany] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productID, setProductID] = useState('');
  const [basePrice, setBasePrice] = useState(''); // Renamed to basePrice for clarity
  const [finalPrice, setFinalPrice] = useState('');

  // Mapping main categories to related product categories
  const mainCategoryMap = {
    Grocery: ['Flour', 'Noodles', 'Pasta', 'Rice', 'Sugar', 'Oil', 'Bread', 'Canned Foods'],
    Dairy: ['Milk', 'Cheese', 'Yogurt'],
    Meats: ['Chicken', 'Beef', 'Pork', 'Fish'],
    Frozen: ['Ice Cream', 'Frozen Vegetables'],
    Beverages: ['Juice', 'Soft Drinks', 'Water'],
    Snacks: ['Chips', 'Cookies', 'Candy'],
    Bakery: ['Bread', 'Pastries'],
    Health: ['Vitamins', 'Supplements', 'Herbal Products'],
  };

  // Mapping product categories to companies
  const categoryCompanyMap = {
    Flour: ['Prima', 'Sarathchandra'],
    Noodles: ['Prima', 'Maggie'],
    Pasta: ['Lucia', 'Carolina'],
    Rice: ['Araliya', 'Nipuna', 'Rathna'],
    Sugar: ['Luckky', 'Orient'],
    Oil: ['Turkey', 'Fortune', 'Marina'],
    Bread: ['Prima'],
    'Canned Foods': ['Tuna Fish', 'Jam'],
    Milk: ['Anchor', 'Highland'],
    Cheese: ['Anchor', 'Kraft'],
    Yogurt: ['Anchor', 'Yoplait'],
    Chicken: ['Crysbro', 'Bairaha'],
    Beef: ['MeatCo', 'Local'],
    Fish: ['Canned Tuna', 'Local Catch'],
  };

  const handleMainCategoryChange = (e) => {
    const selectedMainCategory = e.target.value;
    setMainCategory(selectedMainCategory);
    setProductCategory(''); // Reset product category when main category changes
    setCompany(''); // Reset company when main category changes
  };

  const handleProductCategoryChange = (e) => {
    const selectedProductCategory = e.target.value;
    setProductCategory(selectedProductCategory);
    setCompany(''); // Reset company when product category changes
  };

  const calculateFinalPrice = (basePrice, discountType) => {
    let finalPrice = basePrice;
    if (discountType === 'Seasonal Discount') {
      finalPrice = basePrice * 0.8; // 20% discount
    } else if (discountType === 'Holiday Discount') {
      finalPrice = basePrice * 0.9; // 10% discount
    }
    return finalPrice;
  };

  // Update final price whenever base price or discount type changes
  useEffect(() => {
    if (basePrice) {
      setFinalPrice(calculateFinalPrice(basePrice, discountType));
    }
  }, [basePrice, discountType]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'products'), {
        productName,
        description,
        finalPrice,
        stock,
        company,
        discountType,
        mainCategory,
        productCategory,
        productImage,
        productID,
      });

     
      setProductName('');
      setDescription('');
      setFinalPrice('');
      setStock('');
      setCompany('');
      setDiscountType('');
      setMainCategory('');
      setProductCategory('');
      setProductImage('');
      setProductID('');
      alert('Product added successfully!');

    } catch (error) {
      console.error('Error adding product: ', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="addProductForm2">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="general-info">
          <div className="form-group-product">
            <label>Product ID</label>
            <input
              type="text"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
              required
            />
          </div>
          <div className="form-group-product">
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-group-product">
            <label>Product Image URL</label>
            <input
              type="text"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              required
            />
          </div>
          <div className="form-group-product">
            <label>Product Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        {/* <div className="image-section">
          <h3>Upload Product Image</h3>
          <input type="file" onChange={handleImageUpload} />
          {image && <img src={image} alt="Product" className="product-image" />}
        </div> */}

        <div className="pricing-stock-section">
          <h3>Pricing And Stock</h3>
          <div className="form-group-product">
            <label>Base Price</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group-product">
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <div className="form-group-product">
            <label>Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              required
            >
              <option value="">Select Discount Type</option>
              <option value="No Discount">No Discount</option>
              <option value="Seasonal Discount">Seasonal Discount</option>
              <option value="Holiday Discount">Holiday Discount</option>
            </select>
          </div>
          <div className="form-group-product">
            <label>Final Price (After Discount)</label>
            <input
              type="number"
              value={finalPrice}
              readOnly
              required
            />
          </div>
        </div>

        <div className="category-section">
          <div className="form-group-product">
            <label>Main Category</label>
            <select value={mainCategory} onChange={handleMainCategoryChange} required>
              <option value="">Select Main Category</option>
              {Object.keys(mainCategoryMap).map((mainCat) => (
                <option key={mainCat} value={mainCat}>
                  {mainCat}
                </option>
              ))}
            </select>
          </div>

          {mainCategory && (
            <div className="form-group-product">
              <label>Product Category</label>
              <select
                value={productCategory}
                onChange={handleProductCategoryChange}
                required
                
              >
                <option value="">Select Product Category</option>
      {/* Render the options only if mainCategory is selected */}
            {mainCategory ? (
            mainCategoryMap[mainCategory].map((prodCat) => (
             <option key={prodCat} value={prodCat}>
              {prodCat}
            </option>
          ))
      ) : (
        <option disabled>Select a Main Category first</option>
      )}
              </select>
            </div>
          )}

          {productCategory && (
            <div className="form-group-product">
              <label>Product Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                disabled={!productCategory}
              >
                <option value="">Select Company</option>
                {categoryCompanyMap[productCategory]?.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))
                }
              </select>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button type="reset" className="cancel-product">
            Reset
          </button>
          <button type="submit" className="add-product">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
