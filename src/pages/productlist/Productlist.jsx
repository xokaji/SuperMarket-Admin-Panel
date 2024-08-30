// src/pages/productlist/ProductList.jsx
import React, { useState, useEffect } from 'react';
import './productlist.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'; // Correct path to firebase.jsx
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from the relevant collection, e.g., 'Snacks'
        const productCollection = collection(db, 'Snacks'); // Adjust if needed
        const productSnapshot = await getDocs(productCollection);
        const productList = productSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(productList);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, 'Snacks', id); // Adjust if needed
      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 230,
      renderCell: (params) => (
        <div className="productList">
          <img
            className="productListImg"
            src={params.row.avatar}
            alt={`${params.row.productName}'s avatar`}
          />
          {params.row.productName}
        </div>
      ),
    },
    {
      field: 'company',
      headerName: 'Company',
      width: 180,
    },
    {
      field: 'category',
      headerName: 'Category',
      type: 'string',
      width: 150,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 180,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div className="productListAction">
          <Link to={`/product/${params.row.id}`}>
            <button className="productListEdit">Edit</button>
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
    <div className="container">
      <div style={{ height: 680, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
      <Link to="/newProduct" className="productFloatingButton">
        <button className="productFloatingButton">Create New Product</button>
      </Link>
    </div>
  );
}
