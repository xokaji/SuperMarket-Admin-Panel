import React from 'react';
import './fetures.css';

import ExpiringProductsAlert from '../expire/ExpiringProductsAlert';
import StockLevel from '../stockLevel/StockLevel';
import CustomerCount from '../userCount/customerCount';

export default function Features() {
  return (
    <div className='features'>
      <div className="featuredItem1">
        <span className="featuredTitle">Expiring Stocks</span>
        <div className="moneyContainer">
          <span className="money"><ExpiringProductsAlert/></span>
          {/* <span className="moneyRate">-11.4 <SouthOutlinedIcon className='featuredIcon negative' /></span> */}
        </div>
        <span className="featuredSub">Recent Expired to other stocks</span>
      </div>

      <div className="featuredItem2">
        <span className="featuredTitle">Registered Customers</span>
        <div className="moneyContainer">
          <span className="money2"><CustomerCount/></span>
          {/* <span className="moneyRate">-11.4</span> */}
        </div>
        <span className="featuredSub">All are registered to GreenMart App</span>
      </div>

      <div className="featuredItem3">
        <span className="featuredTitle">Stocks Status</span>
        <div className="moneyContainer">
          <span className="money"><StockLevel/></span>
        
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
