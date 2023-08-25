import React from 'react'
import {Link} from 'react-router-dom'
const Client = ({name,amount,Id,lastDate}) => {
  return (
<>
<tr>
  <td>
  <Link style={{color:"white",textDecoration:"none"}} to ={`/detail/${Id}`} >{name}</Link>
</td>
<td>{lastDate}</td>
<td >₹{amount}</td></tr>
</>
  )
}


export default Client
