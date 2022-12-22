import React from 'react'
import Swal from 'sweetalert2'
import Success from './Success';
import Warning from './Warning';
import { ImUserPlus } from "react-icons/im";
const AddUser = ({ refresh }) => {
  const AddUserHandle = async () => {
    const createUser = async (name) => {
      const parentId = localStorage.getItem('user')
      if (parentId) {
        let result = await fetch('http://localhost:2205/addclient', {
          method: "post",
          body: JSON.stringify({ parentId, name }),
          headers: { 'content-type': 'application/json', "token": `${parentId}` }
        })
        result = await result.json()
        // console.log(result.response)

        if (result.response === "success") {
          Success(`${name}; is Added `)
          refresh()  // to call all users api function in dashboard ;
        } else {
          Warning(result.response)
        }

      }
      else {
        Swal.fire("OMG")
      }
    }

    const { value: Uname } = await Swal.fire({
      title: 'Add New User',
      input: 'text',
      inputLabel: 'New User Name',
      inputValue: "",
      inputPlaceholder: "Enter User Name",
      showCancelButton: true,
      background: "black",
      backdrop: "",
      width: "330px",

      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    })

    if (Uname) {
      createUser(Uname)
    }
  }
  return (
    <div onClick={AddUserHandle} className='d-adduser'><ImUserPlus /></div>

  )
}

export default AddUser


