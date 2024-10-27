import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, getDocs, orderBy, query, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './newproduct.css';

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

// Mapping category to prefix
const categoryPrefixes = {
  'grocery': 'G',
  'dairy&eggs': 'D',
  'meats&seafoods': 'M',
  'frozenfoods': 'F',
  'beverages': 'B',
  'snacks': 'S',
  'bakeryproducts': 'BK',
  'health&wellness': 'H',
};

const subCategories = {
  grocery: ['Flour', 'Noodles', 'Pasta', 'Rice', 'Sugar', 'Salt'],
  'dairy&eggs': ['Margarine', 'Cheese', 'Yogurt', 'Butter', 'Eggs'],
  'meats&seafoods': ['Chicken', 'Beef', 'Pork', 'Fish'],
  frozenfoods: ['Ice Cream', 'Sausages', 'Ham'],
  beverages: ['Juice', 'Soft Drinks', 'Water'],
  snacks: ['Chips', 'Candy', 'Biscuits'],
  bakeryproducts: ['Cakes', 'Cookies', 'Bread'],
  'health&wellness': ['Vitamins', 'Supplements', 'Herbal Products', 'Cleaning Products', 'Soap & Shampoo', 'Personal Care', 'Face Wash Products'],
};

const quantityTypes = {
  grocery: ['1kg', '2kg', '5kg', '200g', '400g', '1kg'],
  'dairy&eggs': ['250g', '500g', '1kg', '6 Pack', '12 Pack'],
  'meats&seafoods': ['250g', '500g', '1kg', 'Whole'],
  frozenfoods: ['500ml', '1L'],
  beverages: ['250ml', '1L', '2L'],
  snacks: ['30g', '100g', '200g'],
  bakeryproducts: ['500g', '1kg'],
  'health&wellness': ['30 Tablets', '60 Tablets', '100ml'],
};

const AddProductForm = () => {
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [quantityType, setQuantityType] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Fetch the highest product ID from the selected category collection
  const fetchProductID = async (selectedCategory) => {
    if (!selectedCategory) return;

    const productCollection = collection(db, selectedCategory);
    const productQuery = query(productCollection, orderBy('productID', 'desc'));
    const productSnapshot = await getDocs(productQuery);

    if (!productSnapshot.empty) {
      const lastProduct = productSnapshot.docs[0].data();
      const lastID = lastProduct.productID;

      let prefix;
      let idNumber;

      // Determine prefix based on category and extract the number part
      if (selectedCategory === 'bakeryproducts') {
        prefix = 'BK';
        idNumber = parseInt(lastID.slice(2)) + 1; // Extract number part for bakery products
      } else {
        prefix = selectedCategory.slice(0, 2).toUpperCase(); // For other categories
        idNumber = parseInt(lastID.slice(2)) + 1; // Increment based on numeric part
      }

      // Set the new product ID with the appropriate prefix
      setProductID(`${prefix}${idNumber}`);
    } else {
      // If no products exist, set the ID starting from 1
      const prefix = selectedCategory === 'bakeryproducts' ? 'BK' : selectedCategory.slice(0, 2).toUpperCase();
      setProductID(`${prefix}1`);
    }
  };

  // Function to check for duplicate products
  const checkForDuplicateProduct = async () => {
    const productCollection = collection(db, category);
    const productQuery = query(productCollection);
    const productSnapshot = await getDocs(productQuery);

    return productSnapshot.docs.some((doc) => {
      const data = doc.data();
      return (
        data.productName === productName &&
        data.companyName === companyName &&
        data.subCategory === subCategory &&
        data.quantityType === quantityType
      );
    });
  };

  const handleImageUpload = async () => {
    const imageRef = ref(storage, `products/${productID}`);
    await uploadBytes(imageRef, productImage);
    return await getDownloadURL(imageRef);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const isDuplicate = await checkForDuplicateProduct();
      if (isDuplicate) {
        alert('This product already exists. Please enter a different product.');
        return;
      }

      const imageURL = await handleImageUpload();
      const productData = {
        productID,
        productName,
        productImage: imageURL,
        price: parseFloat(price),
        category,
        subCategory,
        quantityType,
        companyName,
      };

      const productCollection = collection(db, category); // Matches the category value in the categories array
      const productDocRef = doc(productCollection, productID); // Create a reference with productID
      await setDoc(productDocRef, productData); // Use setDoc to set the document ID
      alert('Product added successfully!');

      // Clear the form after submission
      setProductName('');
      setProductImage(null);
      setPrice('');
      setCategory('');
      setSubCategory('');
      setQuantityType('');
      setCompanyName('');
      setProductID(''); // Clear the product ID after submission
    } catch (error) {
      console.error('Error adding product: ', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="newProd">
      <label className='prod-title'>Add New Products</label>
      <form className="product-form" onSubmit={handleAddProduct}>
        
        <input
          type="text"
          placeholder="Product Name"
          className="input-field product-name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="input-field product-image"
          onChange={(e) => setProductImage(e.target.files[0])}
          required
        />

        <select
          className="select-field product-category"
          value={category}
          onChange={(e) => {
            const selectedCategory = e.target.value;
            setCategory(selectedCategory);
            setSubCategory('');
            setQuantityType('');
            fetchProductID(selectedCategory); // Fetch ID based on the new category
          }}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="product-id-display">
          <input
            type="text"
            value={productID}
            placeholder="Product ID"
            className="input-field product-id"
            readOnly
          />
        </div>

        <select
          className="select-field product-subcategory"
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setQuantityType('');
          }}
          required
          disabled={!category}
        >
          <option value="">Select Sub-Category</option>
          {category &&
            subCategories[category].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
        </select>

        <select
          className="select-field product-quantity-type"
          value={quantityType}
          onChange={(e) => setQuantityType(e.target.value)}
          required
          disabled={!subCategory}
        >
          <option value="">Select Quantity Type</option>
          {subCategory &&
            quantityTypes[category].map((quantity) => (
              <option key={quantity} value={quantity}>{quantity}</option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Company Name"
          className="input-field company-name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        
        <div className="submitB">
          <button type="submit" className="submit-button">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
