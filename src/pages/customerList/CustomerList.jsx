import React, { useEffect, useState } from 'react';
import './customerList.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

export default function DataTable() {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const customers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(customers);
    };

    fetchCustomers();
  }, []);
  

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  
  

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },

    

    {
      field: 'name',
      headerName: 'Full Name',
      width: 230,
      renderCell: (params) => (
        <div className="customerList">
          <div className="customerListImageContainer">
            <img src={params.row.img} alt="customerImg" className='customerListImage'/>
          </div>

          <div className='customerListNameContainer'>{params.row.name}</div>
         
        </div>
      ),
    },
    
    {
      field: 'email',
      headerName: 'E-mail',
      type: 'string',
      width: 250,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      width: 120,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 250,
    },
    {
      field: 'membership',
      headerName: 'Membership',
      width: 120,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div className="userListAction">
          <Link to={`/customers/${params.row.id}`}>
            <button className="userListEdit">View</button>
          </Link>
          <DeleteOutlineOutlinedIcon className="userListDelete" onClick={() => handleDelete(params.row.id)} />
        </div>
      ),
    },
  ];

  return (
    
  
    
    <div className="customercontainer">
      
      <div className="table-header">
        <h2>Customer Details</h2>
        {/* <button className="customer-button">Create</button> */}
      </div>
      
      <div style={{ height: 680, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          className='customerDataGrid'
          
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
