import React from 'react'
import "./widgetsmall.css"
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';


export default function WidgetSmall() {
  return (
    <div className="widgetSm">
        <span className="widgetSmTitle">New Join Customers</span>
      
        <ul className="widgetSmList">
            <li className='widgetSmListItem'>
                <img src="https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""  className='widgetSmImg'/>
                <div className="widgetSmUser">
                    <span className="widgetSmUsername">Manel Illangasinghe</span>
                    <span className="widgetSmUserGender">Female</span>
                </div>
                <button className="widgetSmButton">
                    <VisibilityOutlinedIcon/>
                    Display
                </button>
            </li>

            <li className='widgetSmListItem'>
                <img src="https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""  className='widgetSmImg'/>
                <div className="widgetSmUser">
                    <span className="widgetSmUsername">Manel Illangasinghe</span>
                    <span className="widgetSmUserGender">Female</span>
                </div>
                <button className="widgetSmButton">
                    <VisibilityOutlinedIcon/>
                    Display
                </button>
            </li>

            <li className='widgetSmListItem'>
                <img src="https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""  className='widgetSmImg'/>
                <div className="widgetSmUser">
                    <span className="widgetSmUsername">Manel Illangasinghe</span>
                    <span className="widgetSmUserGender">Female</span>
                </div>
                <button className="widgetSmButton">
                    <VisibilityOutlinedIcon/>
                    Display
                </button>
            </li>

            <li className='widgetSmListItem'>
                <img src="https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""  className='widgetSmImg'/>
                <div className="widgetSmUser">
                    <span className="widgetSmUsername">Manel Illangasinghe</span>
                    <span className="widgetSmUserGender">Female</span>
                </div>
                <button className="widgetSmButton">
                    <VisibilityOutlinedIcon/>
                    Display
                </button>
            </li>
        </ul>
    </div>
  )
}
