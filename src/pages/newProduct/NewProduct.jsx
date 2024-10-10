import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'react-toastify/dist/ReactToastify.css';
import './newproduct.css';

export default function AddNewProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(''); // Stock state added
  const [company, setCompany] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productID, setProductID] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const mainCategoryMap = {
    Grocery: ['Flour', 'Noodles', 'Pasta', 'Rice', 'Sugar', 'Oil', 'Bread', 'Jam'],
    'Dairy & Eggs': ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs'],
    'Meats & Seafoods': ['Chicken', 'Beef', 'Pork', 'Fish'],
    'Frozen Foods': ['Ice Cream', 'Sausages', 'Ham'],
    Beverages: ['Juice', 'Soft Drinks', 'Water'],
    Snacks: ['Chips', 'Candy', 'Biscuits'],
    'Bakery Products': ['Cakes', 'Cookies', 'Short-Eats'],
    'Health & Wellness': ['Vitamins', 'Supplements', 'Herbal Products', 'Medicines', 'Cleaning Products', 'Soap & Shampoo', 'Personal Care', 'Face Wash Products'],
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
    Milk: ['Anchor', 'Highland', 'Palawaththa'],
    Cheese: ['Anchor', 'Kraft', 'Kotmale'],
    Yogurt: ['Anchor', 'Yoplait', 'Ambewela', 'Kotmale'],
    Butter: ['Anchor', 'Kotmale', 'Raththi'],
    Eggs: ['Happy Hen', 'Crysbro'],
    Chicken: ['Crysbro', 'Bairaha'],
    Beef: ['MeatCo', 'Local'],
    Fish: ['Canned Tuna', 'Tora Fish', 'Teppiliya Fish'],
    'Ice Cream': ['Elephant House', 'Cargills'],
    Sausages: ['Elephant House', 'Cargills', 'Prima'],
    Ham: ['Elephant House', 'Cargills', 'Prima'],
    Juice: ['Richlife', 'Cargills', 'Elephant House'],
    'Soft Drinks': ['Coca Cola', 'Pepsi', 'Sprite', 'Fanta', 'EGB'],
    Water: ['Nestle', 'Supan Water'],
    Chips: ['Lays', 'Pringles', 'Cheetos'],
    Candy: ['M&Ms', 'Snickers', 'KitKat', 'Mars', 'Bounty', 'Twix'],
    Biscuits: ['Munchee', 'Maliban', 'Uswatta Products'],
    Cakes: ['Tiara', 'Wijaya Cakes'],
    Cookies: ['Choco Mo', 'Chipie Chap'],
    'Short-Eats': ['Dissanayake Bakers'],
    Vitamins: ['Local Vitamins'],
    Supplements: ['Mars Products', 'Carnivorous', 'Lighting Energy'],
    'Herbal Products': ['Nature Secrets', 'Spa Ceylon'],
    Medicines: ['Panadol', 'Paracetamol', 'Sidhdhalepa', 'IoDEX Bam'],
    'Cleaning Products': ['Harpic', 'Bio-Clean'],
    'Soap & Shampoo': ['Dave', 'Pears', 'Baby Sheramie'],
    'Face Wash Products': ['Nature Secrets', 'Fair & Lovely', 'Fair & Handsome'],
    'Personal Care': ['Signal', 'Clogard', 'Fems', 'Arya'],
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
      setFinalPrice(calculateFinalPrice(Number(basePrice), discountType));
    }
  }, [basePrice, discountType]);

  // Fetch the last product ID from Firestore when component mounts
  useEffect(() => {
    const fetchLastProductID = async () => {
      try {
        const docRef = doc(db, 'config', 'lastProductID');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const lastID = docSnap.data().lastID || 0;
          setProductID(lastID + 1); // Set the next product ID
        } else {
          setProductID(1); // Start from 1 if no lastID exists
        }
      } catch (error) {
        console.error('Error fetching last product ID:', error);
        toast.error('Error fetching last product ID');
      }
    };

    fetchLastProductID();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const storage = getStorage();
    const imageRef = ref(storage, `product-images/${file.name}`);

    try {
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setProductImage(url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image: ' + error.message);
      console.error('Error uploading image: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!productName || !mainCategory || !productCategory || !company || !productImage || stock === '') {
      toast.error('Please fill in all required fields.');
      return;
    }

    const collectionName = mainCategory.toLowerCase().replace(/\s+/g, ''); // Convert to lowercase and replace spaces

    try {
      // Add the product with specified document ID
      await setDoc(doc(collection(db, collectionName), productID.toString()), {
        productName,
        description,
        finalPrice: Number(finalPrice), // Convert to number
        stock: Number(stock), // Convert to number and save stock
        company,
        discountType,
        mainCategory,
        productCategory,
        productImage,
        productID,
        expiryDate,
      });

      // Update the lastProductID in Firestore
      await setDoc(doc(db, 'config', 'lastProductID'), { lastID: productID });

      // Show success toast
      toast.success('Product added successfully!');

      // Reset form fields
      setProductName('');
      setDescription('');
      setFinalPrice('');
      setStock(''); // Reset stock field
      setCompany('');
      setDiscountType('');
      setMainCategory('');
      setProductCategory('');
      setProductImage(null);
      setBasePrice('');
      setExpiryDate('');
      setProductID(productID + 1); // Increment productID for next product
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <form onSubmit={handleSubmit}>
        <h3>Product Basic details</h3>

        <div className="general-info">
          <div className="form-group-product">
            <label>Product ID</label>
            <input type="text" value={productID} readOnly required />
          </div>
          <div className="form-group-product">
            <label>Product Name</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div className="form-group-product">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} required />
          </div>
        </div>

        <div className="pricing-stock-section">
          <h3>Pricings</h3>
          <div className="form-group-product">
            <label>Base Price</label>
            <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
          </div>
          <div className="form-group-product">
            <label>Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <div className="form-group-product">
            <label>Final Price</label>
            <input type="number" value={finalPrice} readOnly />
          </div>
        </div>

        <h3>Product Category</h3>
        <div className="form-group-product">
          <label>Main Category</label>
          <select value={mainCategory} onChange={handleMainCategoryChange} required>
            <option value="">Select Main Category</option>
            {Object.keys(mainCategoryMap).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-product">
          <label>Product Category</label>
          <select value={productCategory} onChange={handleProductCategoryChange} required>
            <option value="">Select Product Category</option>
            {mainCategoryMap[mainCategory]?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-product">
          <label>Company</label>
          <select value={company} onChange={(e) => setCompany(e.target.value)} required>
            <option value="">Select Company</option>
            {categoryCompanyMap[productCategory]?.map((companyName) => (
              <option key={companyName} value={companyName}>
                {companyName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
    </div>
  );
}
