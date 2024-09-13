import React from 'react'
import "./home.css"
import Features from '../../components/features/Features'
import Chart from '../../components/chart/Chart'
import { customerData } from '../../dummyData.js'
import WidgetSmall from '../../components/widgets/smallWidgets/WidgetSmall.jsx'
import WidgetLarge from '../../components/widgets/largeWidgets/WidgetLarge.jsx'
// import GreetingComponent from '../../components/greeting/GreetingComponent .jsx'
// import DateTimeComponent from '../../components/dateNtime/DateTimeComponent.jsx'

export default function Home() {
  return (
    <div className='home'>

          
        <Features/>
        <Chart data ={customerData} title="Customer Analytics" grid dataKey="activeCustomers" />
        <div className="homeWidgets">
          <WidgetSmall/>
          <WidgetLarge/>
        </div>
    </div>
  )
}
