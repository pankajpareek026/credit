import React from 'react'
import {Link} from 'react-router-dom'
const Client = ({name,amount,Id}) => {
  return (

    <div className="client">
    <span className="name"><Link style={{color:"white",textDecoration:"none"}} to ={`/detail/${Id}`} >{name}</Link></span>
    <span className="date">12-09-2022</span>
    <span className="amount"> {amount}</span>
</div>
  )
}


export default Client