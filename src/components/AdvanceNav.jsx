import React from 'react'

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
      <h2  style={{cursor:'pointer'}} onClick={()=>redirect('/')} className="logo small">C</h2>

      <Link to="/" > <HomeIcon fontSize="large"/> </Link>
      <Link to='/user'><AccountCircleIcon fontSize="large" style={{ fontSize: "xx-large" }} /></Link>
    

      <div ><AddUser fontSize="large" refresh={refresh} /></div>
      <div className="d-logout" onClick={logout}>
        <PowerSettingsNewIcon fontSize="large"  onClick={logout} style={{ hover: { color: "red" } }} />
      </div>
      <ToastContainer />

    </div>
  )
}

export default AdvanceNav;
