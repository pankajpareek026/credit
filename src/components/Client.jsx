import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Client = ({ name, amount, Id, lastDate, isClickDisabled, isClientComponent }) => {
  const redirect = useNavigate()
  const click = () => {
    if (isClickDisabled) {
      return 0
    }
    else {
      redirect(`/detail/${Id}`)
    }
  }
  return (
    <>
      {isClientComponent ?

        <tr style={{ cursor: "pointer" }} onClick={() => click()}>
          <td>
            <p style={{ color: "white", textDecoration: "none" }}  >{name}</p>
          </td>
          <td>{lastDate}</td>
          <td > {amount ? `₹ ${parseFloat(amount).toFixed(2)}` : `₹ 0.00`} </td>
        </tr>


        :
        <tr style={{ cursor: "pointer" }} onClick={() => click()}>
          <td>
            <p style={{ color: "white", textDecoration: "none" }}  >{name}</p>
          </td>
          <td>{lastDate}</td>
          <td > {amount ? `₹ ${parseFloat(amount).toFixed(2)}` : ""} </td>
        </tr>
      }
    </>
  )
}


export default Client
