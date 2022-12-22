import React, { useState } from 'react'
import Success from './Success';
import Warning from './Warning';
import { ToastContainer, } from 'react-toastify';
const NewTransaction = ({ uid, refresh }) => {

  const [clickIn, SetClickIn] = React.useState({ dsp: true, active: true })
  const [clickOut, SetClickOut] = React.useState({ dsp: false, active: false })
  const [amount, Setamount] = useState("")
  const [date, Setdate] = useState("")
  const [disc, Setdisc] = useState("")
  const [type, SetType] = useState("")
  const HideOut = (e) => { // this will run when we click on In => Task To hide the out div and giv the 100% widht to IN
    // console.log("in Button licked")
    SetClickIn({ dsp: true, active: true })
    SetClickOut({ dsp: false, active: false })
    // console.log(clickIn)
    // a()
  }
  const AddApi = async (amt, date, dis, type) => {
    let result = await fetch('http://localhost:2205/client/newTransaction', {
      method: "post",
      body: JSON.stringify({ amount, date, dis: dis, type }),
      headers: { 'content-type': 'application/json', uid: uid, token: localStorage.getItem('user') }
    })
    result = await result.json();
    if (result.response == "success") {
      Success(result.response)
      refresh()
    }
    else {
      Warning(result.response)
    }
    // console.log(result)
  }
  const handleIn = (e) => {
    SetType("IN")
    console.log(type)
    console.log(`${amount},${date},${disc},${type},`)
    AddApi(amount, date, disc, "IN")
  }
  const handleOut = (e) => {

    console.log(`${amount},${date},${disc},${type},`)
    AddApi(amount * (-1), date, disc, "OUT")
  }

  const HideIn = () => {
    SetClickOut({ dsp: true, active: true })
    SetClickIn({ dsp: false, active: false })
    // console.log("Out Button Clicked")
    // a()
  }

  return (
    <div className='add-t'>
      <h1>Add Transaction</h1>
      <div className="buttons">
        <button className='in' style={{ backgroundColor: clickIn.active ? "green" : "#100e0f" }} onClick={() => { HideOut(); SetType("OUT") }} >IN</button>
        <button className='out' style={{ backgroundColor: clickOut.active ? "red" : "#100e0e" }} onClick={() => { HideIn(); SetType("IN") }}>OUT</button>
      </div>
      <div className="inner">
        {clickIn.dsp && <div className="in" >

          <div className='form' >
            <h1>IN</h1>
            <input type="number" defaultValue={amount} onChange={(e) => Setamount(e.target.value)} placeholder='Amount' required />
            <input type="datetime-local" defaultValue={date} onChange={(e) => Setdate(e.target.value)} placeholder='date' required />
            <input type="text" defaultValue={disc} onChange={(e) => Setdisc(e.target.value)} placeholder='Comment' required />
            <button onClick={(e) => handleIn(e)}>IN</button>
          </div>

        </div>}

        {clickOut.dsp && <div className="out" style={{ display: clickIn.display, }}>
          <div className='form'>
            <h1>OUT</h1>
            <input type="number" defaultValue={amount} onChange={(e) => Setamount(e.target.value * -1)} placeholder='Amount' required />
            <input type="date" defaultValue={date} onChange={(e) => Setdate(e.target.value)} placeholder='date' required />
            <input type="text" defaultValue={disc} onChange={(e) => Setdisc(e.target.value)} placeholder='Comment' required />
            <button value={"OUT"} onClick={(e) => handleOut(e)}>OUT</button>
          </div>
        </div>
        }
      </div>
      <ToastContainer />
    </div>
  )
}

export default NewTransaction