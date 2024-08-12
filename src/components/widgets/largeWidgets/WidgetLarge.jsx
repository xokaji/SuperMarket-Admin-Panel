import React from 'react'
import "./widgetLarge.css"

export default function WidgetLarge() {

  const Button = ({type}) => {
    return <button className={`widgetLgButton ${type}`}>{type}</button>;
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Transactions</h3>
      <table className="widgetLgtable">
        <tr className="widgetLgTr">
          <th className="widgetLgth">Customer</th>
          <th className="widgetLgth">Date</th>
          <th className="widgetLgth">Amount</th>
          <th className="widgetLgth">Method</th>
        </tr>

        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img src="https://images.pexels.com/photos/1288182/pexels-photo-1288182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className='widgetLgImg' />
            <span className="widgetlgName">Janith Madhawa</span>
          </td>
          <td className="widgetLgDate">2 Jun 2024</td>
          <td className="widgetLgAmount">$122.00</td>
          <td className="widgetLgMethod"><Button type="CashOnDelivery" /></td>
        </tr>

        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img src="https://images.pexels.com/photos/1288182/pexels-photo-1288182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className='widgetLgImg' />
            <span className="widgetlgName">Janith Madhawa</span>
          </td>
          <td className="widgetLgDate">2 Jun 2024</td>
          <td className="widgetLgAmount">$122.00</td>
          <td className="widgetLgMethod"><Button type="OnlinePaid"/></td>
        </tr>
      </table>
    </div>
  )
}
