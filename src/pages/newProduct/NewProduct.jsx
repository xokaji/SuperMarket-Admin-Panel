import './newproduct.css'

export default function NewProduct() {
  return (
    
    <div className="newProduct">
        <h1 className="newProductTitle">New Product</h1>
        <div className="productBorder">
        <form action="" className="newProductForm">
        
          <div className="newProductItem">
            <label>Product Name</label>
            <input type="text" placeholder='Chocolate Biscuits' />
          </div>

          <div className="newProductItem">
            <label>Company</label>
            <input type="text" placeholder='Munchee' />
          </div>

          <div className="newProductItem">
            <label>Category</label>
            <input type="text" placeholder='Snacks' />
          </div>

          <div className="newProductItem">
            <label>Price</label>
            <input type="text" placeholder='Rs.120.00' />
          </div>
          <div className="newProductItem">
            <label>Stock</label>
            <input type="text" placeholder='320' />
          </div>
          
          <div className="newProductButton">
            <button className="newProductButton">
              Create 
            </button>
          </div>
          
          
        </form>
        </div>
    </div>
  )
}
