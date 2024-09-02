import React, { useState, useEffect } from 'react';
import './transactions.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'; // Correct path to firebase.jsx
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Transactions() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionList = collection(db, 'transactions'); // Adjust if needed
        const transactionSnapshot = await getDocs(transactionList);
        const TrList = transactionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(TrList);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, 'transactions', id); // Adjust if needed
      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Customer Details',
      width: 220,
      renderCell: (params) => (
        <div className="productList">
          {params.row.name}
        </div>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 180,
    },
    {
        field: 'time',
        headerName: 'Time',
        width: 180,
      },
    
    // {
    //   field: 'transactionID',
    //   headerName: 'Transaction ID',
    //   width: 180,
    // },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <span className={params.row.status === 'Paid' ? 'statusPaid' : 'statusUnpaid'}>
          {params.row.status}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div className="productListAction">
          <Link to={`/product/${params.row.id}`}>
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