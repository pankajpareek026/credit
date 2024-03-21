import React, { useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddUser from './AddUser';
import Success from './SuccessToast';
import CustomModal from '../mui_comps/CustomModal';
import { useDispatch } from 'react-redux';
import Error from './ErrorToast';
import api from '../api_source';
import { logout } from '../features/reducers/authSlice';
import Logo from './Logo';



const AdvanceNav = ({ refresh, isDashboard = false, isAddUser }) => {
  const redirect = useNavigate()
  const location = useLocation()
  const [isLogoutModal, setIsLogoutModal] = useState(false)
  const path = location.pathname
  const dispatch = useDispatch()
  const activeColor = "#14f195"
  const activeBg = "#303134"
  const closeModal = () => {
    setIsLogoutModal(false)
  }
  const logoutHandle = () => {
    try {

      fetch(`${api}/logout`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        mode: 'cors'
      }).then(res => res.json())
        .then((result) => {
          if (result.isSuccess) {
            Success(result.message)
            setTimeout(() => {
              localStorage.removeItem("user");
              dispatch(logout())
            }, 1500)
            return
          }
          return Error(result.message)
        })
        .finally(() => {
          setIsLogoutModal(false)
        })
        .catch((err) => {
          Error(err.message)
        });

    } catch (error) {
      Error(error.message);
    }
  }
  return (
    <div className="advance-nav">

      <CustomModal
        openModal={isLogoutModal}
        closeModal={closeModal}
        isTitle={true}
        title={"logout"}
        modalType={"confirm"}
        content={"Are you sure you want to log out? This action will end your current session."}
        isFirstButton={true}
        firstButtonName={"cancel"}
        firstButtonType={"close"}
        firstOnClick={closeModal}
        isSecondButton={true}
        secondButtonName={"logout"}
        secodButtonType={"delete"}
        secodOnClick={logoutHandle}
      />


      {/* for navbar in left side */}
      <Logo isAdvanceNav={true} />
      {/* <h2 style={{ cursor: 'pointer' }} onClick={() => redirect('/')} className="logo small">Credit</h2> */}
      <hr />

      <button style={{ backgroundColor: (path === "/") && activeColor, color: (path === "/") && "#000000" }} onClick={() => redirect('/')}  > <HomeIcon /> <span>Home</span>   </button>

      {isDashboard && <button style={{ backgroundColor: (path === "/dashboard") && activeBg, color: (path === "/dashboard") && activeColor }} onClick={() => redirect('/dashboard')} >
        <DashboardIcon /> <span> Dashboard</span> </button>}


      <button style={{ backgroundColor: (path === "/me") && activeBg, color: (path === "/me") && activeColor }} onClick={() => redirect('/me')}  ><AccountCircleIcon fontSize="large" /> <span>Profile</span> </button>



      {/* {isAddUser && <AddUser fontSize="large" refresh={refresh} />} */}



      <button className='logout-btn' onClick={() => setIsLogoutModal(true)}><PowerSettingsNewIcon className='logout-icon' /><span>Logout</span></button>

      <ToastContainer />

    </div>


  )
}

export default AdvanceNav;
