import React, { useEffect, useState } from 'react';
import './customerList.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const customers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'users', id));

      // Update local state to remove the deleted customer
      setData(data.filter((item) => item.id !== id));

      // Show success toast
      toast.success('Customer deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);

      // Show error toast
      toast.error('Error deleting customer', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, headerClassName: 'custom-header' },
    {
      field: 'name',
      headerName: 'Full Name',
      width: 230,
      headerClassName: 'custom-header',
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
      headerName: 'E-mail Address',
      headerClassName: 'custom-header',
      type: 'string',
      width: 250,
    },
    {
      field: 'phone',
      headerName: 'Contact No.',
      headerClassName: 'custom-header',
      width: 140,
    },
    {
      field: 'address',
      headerClassName: 'custom-header',
      headerName: 'Address',
      width: 180,
    },
    {
      field: 'membership',
      headerName: 'Fresco Membership',
      headerClassName: 'custom-header',
      width: 180,
      renderCell: (params) => (
        <span className={params.value === 'Active' ? 'membership-active' : 'membership-inactive'}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      headerClassName: 'custom-header',
      width: 150,
      renderCell: (params) => (
        <div className="userListAction">
          <Link to={`/customers/${params.row.id}`}>
            <button className="userListEdit">View</button>
          </Link>
          {/* <DeleteOutlineOutlinedIcon 
            className="userListDelete" 
            onClick={() => handleDelete(params.row.id)} 
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div className="customercontainer">
      <div className="table-header">
        <h2>Customer Details</h2>
      </div>
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
      <ToastContainer />
    </div>
  );
}
