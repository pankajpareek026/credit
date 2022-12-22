import { React, useEffect, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import Success from './Success'
import Warning from './Warning'




function Login(e) {
    const Isuser = localStorage.getItem('user')
    const redirect = useNavigate()
    const [email, SetEmail] = useState("")
    const [pass, Setpass] = useState("")
    const [hide, Sethide] = useState(true)
    const [err, Seterr] = useState(false)
    const [disable, SetDisable] = useState(false)

    const loginHandle = async () => {
        if (!email || !pass) {
            Seterr(true)
            Warning("All fiels are required")
        }
        else {
            
            SetDisable(true)
            let result = await fetch('http://localhost:2205/login', {
                method: "post",
                body: JSON.stringify({ email, pass }),
                headers: { 'content-type': "application/json" }
            })
            result = await result.json()
            if (result.response == "success") {
                localStorage.setItem("user", result.user)
                Success(result.response)
               setTimeout(()=>{
                redirect('/dashboard')
               },150)
            }
            else {
                Warning(result.response);
                // e.target.disabled = false
                SetDisable(false)
            }

            console.log(result);
        }
    }
    return (<>
        <Navbar />
        <div className="login-container">
            <ToastContainer />
            <div className='Login'>
                <h2>Login</h2>
                <input type="email" onChange={(e) => SetEmail(e.target.value)} placeholder='Email' />
                {(err && !email) && <span style={{ color: "red" }}>Email Requires</span>}
                <input type={hide ? "password" : 'text'} onChange={(e) => Setpass(e.target.value)} placeholder='password' />
                {(err && !pass) && <span style={{ color: "red" }}>Password Requires</span>}
                {hide ? <AiFillEyeInvisible onClick={() => Sethide((e) => !e)} style={{ fontSize: "x-large", width: "30px", marginLeft: "auto", marginRight: "25px", color: 'gray', marginTop: "-55px", cursor: "pointer" }} /> : <AiFillEye onClick={() => Sethide((e) => !e)} style={{ width: "30px", fontSize: "x-large", marginLeft: "auto", marginRight: "25px", color: 'gray', marginTop: "-55px", cursor: "pointer" }} />}
                <Link>Forget password ?</Link>
                <button disabled={disable} style={{ backgroundColor: disable && "gray" }} onClick={(e) => loginHandle(e)}>Login</button>
                <p>Don't have an account  <Link to="/register">Creare New </Link>?</p>
            </div>
        </div>
        <Footer />
    </>
    )
}
export default Login;