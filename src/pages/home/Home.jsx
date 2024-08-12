import React from 'react'
import "./home.css"
import Features from '../../components/features/Features'
import Chart from '../../components/chart/Chart'
import { userData } from '../../dummyData.js'
import WidgetSmall from '../../components/widgets/smallWidgets/WidgetSmall.jsx'
import WidgetLarge from '../../components/widgets/largeWidgets/WidgetLarge.jsx'


export default function Home() {
  return (
    <div className='home'>
        <Features/>
        <Chart data ={userData} title="User Analytics" grid dataKey="activeUsers" />
        <div className="homeWidgets">
          <WidgetSmall/>
          <WidgetLarge/>
        </div>
    </div>
  )
}
