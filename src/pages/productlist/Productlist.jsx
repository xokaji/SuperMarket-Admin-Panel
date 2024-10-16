import React, { useState, useEffect } from 'react';
import './productlist.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'; // Ensure this path is correct
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = [];
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

        for (const category of categories) {
          const productCollection = collection(db, category);
          const productSnapshot = await getDocs(productCollection);

          if (!productSnapshot.empty) {
            const products = productSnapshot.docs.map((doc) => {
              const data = doc.data();
              // Calculate total stock from inStockMonth
              const inStockMonth = data.inStockMonth || {};
              let totalStock = 0;
              for (let month in inStockMonth) {
                totalStock += inStockMonth[month].stockCount || 0;
              }

              return {
                id: doc.id,
                ...data,
                finalPrice: Number(data.finalPrice) || 0,
                totalStock, // Add totalStock to each product
                mainCategory: category,
              };
            });

            allProducts.push(...products);
            console.log(`Fetched ${products.length} products from category: ${category}`);
          }
        }

        setData(allProducts);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const product = data.find((item) => item.id === id);
      if (product) {
        const docRef = doc(db, product.mainCategory, id);
        await deleteDoc(docRef);
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredData = selectedCategory
    ? data.filter((item) => item.mainCategory === selectedCategory)
    : data;

  const columns = [
    { field: 'productID', headerName: 'ID', width: 70, headerClassName: 'custom-header' },
    {
      field: 'productName',
      headerName: 'Product Name',
      headerClassName: 'custom-header',
      width: 280,
      renderCell: (params) => (
        <div className="productList">
          <img className="productListImg" src={params.row.productImage} alt={`${params.row.productName}'s avatar`} />
          {params.row.productName}
        </div>
      ),
    },
    {
      field: 'company',
      headerClassName: 'custom-header',
      headerName: 'Company',
      width: 200,
    },
    {
      field: 'mainCategory',
      headerName: 'Category',
      headerClassName: 'custom-header',
      type: 'string',
      width: 180,
    },
    {
      field: 'finalPrice',
      headerName: 'Price',
      headerClassName: 'custom-header',
      width: 120,
    },
    {
      field: 'totalStock', // Ensure this is correct
      headerName: 'Total Stock',
      headerClassName: 'custom-header',
      width: 120,
    },
    {
      field: 'action',
      headerName: 'Action',
      headerClassName: 'custom-header',
      width: 150,
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
          <h2>Products Details</h2>
          <div className="pbutton">
            <Link to="/products/new">  
            <button className="product-button">+</button>
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
