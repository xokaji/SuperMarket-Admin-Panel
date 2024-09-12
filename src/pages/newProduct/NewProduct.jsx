import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
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
  const [basePrice, setBasePrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // New expiry date state

  // Category mappings
  const mainCategoryMap = {
    Grocery: ['Flour', 'Noodles', 'Pasta', 'Rice', 'Sugar', 'Oil', 'Bread', 'Jam'],
    'Dairy & Eggs': ['Milk', 'Cheese', 'Yogurt', 'Butter','Eggs'],
    'Meats & Seafoods': ['Chicken', 'Beef', 'Pork', 'Fish'],
    'Frozen Foods': ['Ice Cream', 'Sausages','Ham'],
    Beverages: ['Juice', 'Soft Drinks', 'Water'],
    Snacks: ['Chips','Candy','Biscuits'],
    'Bakery Products': [ 'Cakes','Cookies','Short-Eats'],
    'Health & Wellness': ['Vitamins', 'Supplements', 'Herbal Products','Medicines','Cleaning Products','Soap & Shampoo','Personal Care','Face Wash Products'],
  };

  const categoryCompanyMap = {
    Flour: ['Prima', 'Sarathchandra'],
    Noodles: ['Prima', 'Maggie'],
    Pasta: ['Lucia', 'Carolina'],
    Rice: ['Araliya', 'Nipuna', 'Rathna'],
    Sugar: ['Luckky', 'Orient'],
    Oil: ['Turkey', 'Fortune', 'Marina'],
    Bread: ['Prima', 'Sumihiru Products'],
    Jam: ['MD Products', 'Kist'],
    Milk: ['Anchor', 'Highland','Palawaththa'],
    Cheese: ['Anchor', 'Kraft','Kotmale'],
    Yogurt: ['Anchor', 'Yoplait', 'Ambewela','Kotmale'],
    Butter: ['Anchor', 'Kotmale', 'Raththi'],
    Eggs: ['Happy Hen','Crysbro'],
    Chicken: ['Crysbro', 'Bairaha'],
    Beef: ['MeatCo', 'Local'],
    Fish: ['Canned Tuna', 'Tora Fish', 'Teppiliya Fish'],
    'Ice Cream': ['Elephant House', 'Cargills'],
    Sausages: ['Elephant House', 'Cargills', 'Prima'],
    Ham: ['Elephant House', 'Cargills', 'Prima'],
    Juice: ['Richlife', 'Cargills', 'Elephant House'],
    'Soft Drinks': ['Coca Cola', 'Pepsi', 'Sprite', 'Fanta','EGB'],
    Water: ['Nestle', 'Supan Water'],
    Chips: ['Lays', 'Pringles', 'Cheetos'],
    Candy: ['M&Ms', 'Snickers', 'KitKat','Mars','Bounty','Twix'],
    Biscuits: ['Munchee', 'Maliban', 'Uswatta Products'],
    Cakes: ['Tiara', 'Wijaya Cakes'],
    Cookies: ['Choco Mo', "Chipie Chap"],
    'Short-Eats':['Dissanayake Bakers'],
    Vitamins: ['Local Vitamins'],
    Supplements:['Mars Products', 'Carnivorous','Lighting Energy'],
    'Herbal Products':['Nature Secrets','Spa Ceylon'],
    Medicines:['Panadol','Paracitamol','Sidhdhalepa','IoDEX Bam'],
    'Cleaning Products':['Harpic','Bio-Clean'],
    'Soap & Shampoo':['Dave', 'Pears', 'Baby Sheramie'],
    'Face Wash Products':['Nature Secrets','Fair & Lovely', 'Fair & Handsome' ],
    'Personal Care': ['Signal','Clogard','Fems','Arya']
 
  };

  const handleMainCategoryChange = (e) => {
    const selectedMainCategory = e.target.value;
    setMainCategory(selectedMainCategory);
    setProductCategory('');
    setCompany('');
  };

  const handleProductCategoryChange = (e) => {
    const selectedProductCategory = e.target.value;
    setProductCategory(selectedProductCategory);
    setCompany('');
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

  useEffect(() => {
    if (basePrice) {
      setFinalPrice(calculateFinalPrice(basePrice, discountType));
    }
  }, [basePrice, discountType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!productName || !productID || !basePrice || !stock || !expiryDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

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
        expiryDate, // Adding expiry date to Firestore
      });

      // Show success toast
      toast.success('Product added successfully!');

      // Reset form fields
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
      setExpiryDate(''); // Reset expiry date
      setBasePrice('');
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
      console.error('Error adding product: ', error);
    }
  };

  return (
    <div className="addProductForm2">
    
      <div className="productTitle">
        <label>Add New Product</label>
      </div>
      

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <form onSubmit={handleSubmit}>
        <h3>Product Basic details</h3>
        {/* General Info */}
        <div className="general-info">
          <div className="form-group-product">
            <label>Product ID</label>
            <input type="text" value={productID} onChange={(e) => setProductID(e.target.value)} required />
          </div>
          <div className="form-group-product">
            <label>Product Name</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div className="form-group-product">
            <label>Product Image URL</label>
            <input type="text" value={productImage} onChange={(e) => setProductImage(e.target.value)} required />
          </div>
          <div className="form-group-product">
            <label>Product Expiry Date</label>
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required /> {/* New Expiry Date Field */}
          </div>
          <div className="form-group-product">
            <label>Product Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
        </div>

        {/* Pricing and Stock */}
        <div className="pricing-stock-section">
          <h3>Pricing And Stock</h3>
          <div className="general-info2">
          <div className="form-group-product2">
            <label>Base Price</label>
            <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
          </div>
          <div className="form-group-product2">
            <label>Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <div className="form-group-product2">
            <label>Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} required>
              <option value="">Select Discount Type</option>
              <option value="No Discount">No Discount</option>
              <option value="Seasonal Discount">Seasonal Discount</option>
              <option value="Holiday Discount">Holiday Discount</option>
            </select>
          </div>
          <div className="form-group-product2">
            <label>Final Price (After Discount)</label>
            <input type="number" value={finalPrice} readOnly required />
          </div>
        </div>
        </div>

        {/* Categories */}
        <div className="category-section">
          <h3>Products Categorize</h3>
          <div className="form-group-product3">
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
            <div className="form-group-product3">
              <label>Product Category</label>
              <select value={productCategory} onChange={handleProductCategoryChange} required>
                <option value="">Select Product Category</option>
                {mainCategoryMap[mainCategory].map((prodCat) => (
                  <option key={prodCat} value={prodCat}>
                    {prodCat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {productCategory && (
            <div className="form-group-product3">
              <label>Product Company</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)} required>
                <option value="">Select Company</option>
                {categoryCompanyMap[productCategory].map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
