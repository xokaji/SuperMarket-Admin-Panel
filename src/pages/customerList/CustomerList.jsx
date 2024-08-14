import React from 'react'
import './customerList.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { customerRows } from '../../dummyData';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const columns = [
  { field: 'id', headerName: 'ID', width: 10 },
  { field: 'userName', headerName: 'Full Name', width: 230, renderCell: params => 
      <div className="userListUser">  
        <img className="userListImg" src={params.row.avatar} alt="" />
        {params.row.userName}
      </div> 
  },
  
  {
    field: 'email',
    headerName: 'E-mail', 
    type: 'string',
    width: 150,
  },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
  {field: 'address', headerName: 'Address', width: 350 },
  {field: 'membership', headerName: 'Membership', width: 100 },
  {field: 'action', headerName: 'Action', width: 120, renderCell: params => 
      
      <div className="userListAction">
        <Link to={`/customer/${params.row.id}`}>
          <button className="userListEdit">Edit</button>
        </Link>
          <DeleteOutlineOutlinedIcon className="userListDelete" />
      </div>
   },
   
  
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];



export default function DataTable() {
  return (
    <div className="container">
    <div style={{ height: 680, width: '100%' }}>
      <DataGrid
        rows={customerRows}
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