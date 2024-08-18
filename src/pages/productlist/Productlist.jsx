import React, { useState } from 'react';
import './productlist.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { productRows } from '../../dummyData';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

export default function DataTable() {
  const [data, setData] = useState(productRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 230,
      renderCell: (params) => (
        <div className="productList">
          <img className="productListImg" src={params.row.avatar} alt={`${params.row.productName}'s avatar`} />
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
          <DeleteOutlineOutlinedIcon className="productListDelete" onClick={() => handleDelete(params.row.id)} />
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
    </div>
  );
}
