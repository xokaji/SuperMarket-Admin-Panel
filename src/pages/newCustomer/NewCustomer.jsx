import './newcustomer.css'

export default function NewCustomer() {
  return (
    
    <div className="newCustomer">
        <h1 className="newCustomertitle">New Customer</h1>
        <form action="" className="newCustomerForm">
        
          <div className="newCustomerItem">
            <label>Name</label>
            <input type="text" placeholder='John Smith' />
          </div>

          <div className="newCustomerItem">
            <label>Email</label>
            <input type="email" placeholder='johnsmith@gmail.com' />
          </div>

          <div className="newCustomerItem">
            <label>Phone Number</label>
            <input type="number" placeholder='07012345678' />
          </div>

          <div className="newCustomerItem">
            <label>Address</label>
            <input type="text" placeholder='New York | USA' />
          </div>
          
          <div className="newCustomerItem">
            <label>Membership Status</label>
            <select name="active" id="active" className='memebership'>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="newCustomerButton">
            <button className="newCustomerButton">
              Create 
            </button>
          </div>
          
          
        </form>
    </div>
  )
}
