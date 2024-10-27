import React, { useState, useEffect } from 'react';
import './productlist.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default function ProductList() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
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

    const unsubscribeListeners = categories.map((category) => {
      const productCollection = collection(db, category);

      return onSnapshot(productCollection, (snapshot) => {
        setData((prevData) => {
          const updatedProducts = snapshot.docs.map((doc) => {
            const data = doc.data();
            let totalStock = 0;

            if (data.inStockMonth) {
              totalStock = Object.values(data.inStockMonth).reduce(
                (acc, { stockCount = 0 }) => acc + stockCount,
                0
              );
            }

            return {
              id: doc.id,
              ...data,
              finalPrice: Number(data.finalPrice) || 0,
              totalStock,
              mainCategory: category,
              quantityType: data.quantityType || 'N/A', // Fetching the quantity type
            };
          });

          const filteredData = prevData.filter((item) => item.mainCategory !== category);
          return [...filteredData, ...updatedProducts];
        });
      });
    });

    return () => unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
  }, []);

  const handleDelete = async (id) => {
    try {
      const product = data.find((item) => item.id === id);
      if (product) {
        await deleteDoc(doc(db, product.mainCategory, id));
        setData((prevData) => prevData.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const filteredData = selectedCategory
    ? data.filter((item) => item.mainCategory === selectedCategory)
    : data;

  const columns = [
    { field: 'productID', headerName: 'ID', width: 70, headerClassName: 'custom-header' },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 220,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <div className="productList">
          <img className="productListImg" src={params.row.productImage} alt={params.row.productName} />
          {params.row.productName}
        </div>
      ),
    },
    { field: 'companyName', headerName: 'Company', width: 180, headerClassName: 'custom-header' },
    { field: 'mainCategory', headerName: 'Category', width: 150, headerClassName: 'custom-header' },
    { field: 'finalPrice', headerName: 'Price', width: 120, headerClassName: 'custom-header' },
    { field: 'quantityType', headerName: 'Quantity Type', width: 150, headerClassName: 'custom-header' }, // New column for Quantity Type
    { field: 'totalStock', headerName: 'Total Stock', width: 120, headerClassName: 'custom-header' },
    
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <div className="productListAction">
          <Link to={`/products/${params.row.mainCategory}/${params.row.id}`}>
            <button className="productListEdit">View</button>
          </Link>
          <DeleteOutlineOutlinedIcon
            className="productListDelete"
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pcontainer">
      <div className="table-header-product">
        <div className="newpcontainer">
          <h2>Product Details</h2>
          <div className="pbutton">
            <Link to="/products/new">
              <button className="product-button">Add Product</button>
            </Link>
          </div>
        </div>

        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="grocery">Grocery</option>
          <option value="dairy&eggs">Dairy & Eggs</option>
          <option value="meats&seafoods">Meats & Seafoods</option>
          <option value="frozenfoods">Frozen Foods</option>
          <option value="beverages">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="bakeryproducts">Bakery</option>
          <option value="health&wellness">Health & Wellness</option>
        </select>
      </div>

      <div style={{ height: 680, width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </div>
  );
}
