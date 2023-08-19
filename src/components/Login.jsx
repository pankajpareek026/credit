import { React, useEffect, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import Success from './Success'
import Warning from './Warning'
import Loading from './Loading';
import api from '../api_source'




function Login(e) {
    const Isuser = localStorage.getItem('user')
    const redirect = useNavigate()
    const [email, SetEmail] = useState("")
    const [pass, Setpass] = useState("")
    const [hide, Sethide] = useState(true)
    const [err, Seterr] = useState(false)
    const [disable, SetDisable] = useState(false)
    const [loading, SetLoading] = useState(false)

    const loginHandle = async () => {
        if (!email || !pass) {
            Seterr(true)
            Warning("All fiels are required")
        }
        else {

            SetDisable(true)
            SetLoading(true)
            let result = await fetch(`${api}/login`, {
                method: "post",
                body: JSON.stringify({ email, pass }),
                headers: { 'content-type': "application/json" }
            })
            result = await result.json()
            if (result.response == "success") {
                localStorage.setItem("user", result.user)
                SetLoading(false)
                Success(result.response)
                setTimeout(() => {
                    redirect('/dashboard')
                }, 150)
            }
            else {
                Warning(result.response);
                // e.target.disabled = false
                SetDisable(false)
                SetLoading(false)
            }

            console.log(result);
        }
    }
    return (<>
        <Navbar />
        <div className="login-container">
            <ToastContainer />

            <div className='Login'>
                {loading && <Loading />}
                <h2>Login</h2>

                <input type="email" onChange={(e) => SetEmail(e.target.value)} placeholder='Email' />
                {(err && !email) ? <span style={{ color: "red" }}>Email Requires</span>:""}

               
              <div className="pass">  <input type={hide ? "password" : 'text'} onChange={(e) => Setpass(e.target.value)} placeholder='password' />

                       <p> {hide ? <VisibilityOffIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large",  cursor: "pointer" }} /> : 
                        <VisibilityIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer"  }} />}</p>
</div>
                <Link>Forget password ?</Link>
                <button className='log-btn' disabled={disable} style={{ backgroundColor: disable && "gray" }} onClick={(e) => loginHandle(e)}>Login</button>
                <p>Don't have an account  <Link to="/register">Create New </Link>?</p>
            </div>
        </div>
        <Footer />
    </>
    )
}
export default Login;