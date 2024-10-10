import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./chart.css"

export default function Chart({title, data, dataKey, grid}) {
  return (
    <div className='chart'>
        <h3 className="chartTitle">{title}</h3>
        <ResponsiveContainer width="100%" aspect={4 / 1}>
            <LineChart data={data}>
                <XAxis dataKey="name" stroke="#555"/>
                <YAxis tickCount={5} /> 
                {/* <YAxis domain={[1, 5000]} />  Set Y-axis range from 0 to 500 */}
                <Line type="monotone" dataKey={dataKey} stroke="rgba(120,190,32,255)"/>
                <Tooltip/>
                <Legend/>
                {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5"/>}
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
