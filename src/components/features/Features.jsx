import React from 'react'
import "./fetures.css"
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';


export default function Features() {
  return (
    <div className='features'>
        <div className="featuredItem">
            <span className="featuredTitle">Revenue</span>
            <div className="moneyContainer">
                <span className="money">$2,415</span>
                <span className="moneyRate">-11.4 <SouthOutlinedIcon className='featuredIcon negative'/> </span>
            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>

        <div className="featuredItem">
            <span className="featuredTitle">Sales</span>
            <div className="moneyContainer">
                <span className="money">$2,415 <StraightOutlinedIcon className='featuredIcon'/></span>
                <span className="moneyRate">-11.4 </span>
            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>

        <div className="featuredItem">
            <span className="featuredTitle">Cost</span>
            <div className="moneyContainer">
                <span className="money">$2,415</span>
                <span className="moneyRate">+11.4 <StraightOutlinedIcon className='featuredIcon'/> </span>
            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>
    </div>
  )
}
