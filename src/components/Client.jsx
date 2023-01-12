import React from 'react'
import {Link} from 'react-router-dom'
const Client = ({name,amount,Id}) => {
  return (
<>
<tr>
  <td>
  <Link style={{color:"white",textDecoration:"none"}} to ={`/detail/${Id}`} >{name}</Link>
</td>
<td>12-09-2022</td>
<td >₹{amount}</td></tr>
</>
  )
}


export default Client
