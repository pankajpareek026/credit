import React from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import {SlOptionsVertical} from 'react-icons/si'
const TransactionComp = ({ type, amount, date, dis ,show}) => {
  // to display the popUp
  const [click, Setclick] = useState(false)
  const showDetails = (amount, date, dis, type) => {
    Setclick(true)
    Swal.fire({

      showConfirmButton: false,
      showCloseButton: false,
      padding: "0px",
      background: "black",
      width: "320px",
      allowOutsideClick: true,
      // showCloseButton: true,

      html:
        ` <div style="  display: grid;
        background-color: black;
        width: 100%;
        color: white;
        position: inharit;
        top: 15%;
        left: 33%;
        height: 100%;
        font-family: monospace;
        font-size: large;
        border-radius: 10px;">
            <h2 style="text-align: center;
            border-radius: 7px;
            padding: 10px 0px;
            margin-top: 0;
            width: 100%;
            margin-bottom: 15px;
            background-color: rgb(48, 44, 44);
            color:white; text-align: center;
            border-radius: 7px;
            padding: 10px 0px;
            margin-top: 0;
            width: 100%;
            margin-bottom: 15px;
            background-color: rgb(48, 44, 44);
            color:white;
          ">${amount}</h2>
    
            <div style=" display: flex;
            text-align: center;
            width: 100%;
            background-color: rgb(48, 44, 44);
            border-radius: 10px 10px 0px 0px;"> <span style="margin-left: 5%;
      padding: 10px;
      padding-top: 13px;
      text-align: center;
      overflow: auto;color:white;">Date :</span> <span style="margin-left: 5%;
      padding: 10px;
      padding-top: 13px;
      text-align: center;
      overflow: auto; color:white;"> ${date}</span></div>
            <div style=" display: flex;
            text-align: center;
            width: 100%;
            background-color: rgb(48, 44, 44);
            text-align: center;"> <span style="margin-left: 5%;
      padding: 10px;
      padding-top: 13px;
      text-align: center;
      overflow: auto;">Discryption :</span> <span style="margin-left: 5%;
      padding: 10px;
      padding-top: 13px;
      text-align: center;
      overflow: auto;"> ${dis}</span> </div>
            <div style="display: flex;
            text-align: center;
            padding-bottom:15px;
            border-radius: 0px 0px 10px 10px;
            width: 100%;
            background-color: gray;
            text-align: center;
          "> <span style=" margin-left: 5%;
      padding: 10px;
      padding-top: 13px;
      text-align: center;
      overflow: auto;">Type :</span> <span style="margin-left: 5%;
                padding: 10px;
                padding-top: 13px;
                text-align: center;
                overflow: auto;"> ${type}</span> </div>    
        </div>`
    })
  }
  
  return (
    <>
      {click && <div>{() => showDetails(amount, date, dis, type)}</div>}
      <div  onClick={() => showDetails(amount, date, dis, type)}  className={`Transaction-comp ${type}`}>
        <div className="tc-amt">₹{amount}</div>
        <p className='tc-date'>{date}</p> <SlOptionsVertical/>
      </div>
    </>
  )
}

export default TransactionComp



