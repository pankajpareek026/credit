import React from 'react'
import { SiAddthis } from "react-icons/si";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css';
import { MdSpaceDashboard } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { Link } from 'react-router-dom'
import { FaPowerOff } from "react-icons/fa";
import AddUser from './AddUser';
import Success from './Success';

const AdvanceNav = ({ refresh }) => {
  const redirect = useNavigate()
  const logout = () => {
    // localStorage.clear()
    Swal.fire({
      title: 'Logout',
      icon: 'warning',
      background: "black",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout ',
      innerWidth: "200px"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear()
        // console.log("hitted", localStorage.clear())
        Success(`Logged Out`)
        setTimeout(() => {
          redirect('/login')
        }, 1200);
      }
    })

  }
  return (
    <div className="left mobile-nav">
      {/* for navbar in left side */}
      <h2 className="logo small">C</h2>

      <Link to="/" ><HiHome style={{ fontSize: "xx-large" }} /></Link>
      <Link to='/user'><HiOutlineUserCircle style={{ fontSize: "xx-large" }} /></Link>
    

      <div ><AddUser refresh={refresh} /></div>
      <div className="d-logout" onClick={logout}>
        <FaPowerOff onClick={logout} style={{ hover: { color: "red" } }} />
      </div>
      <ToastContainer />

    </div>
  )
}

export default AdvanceNav;
