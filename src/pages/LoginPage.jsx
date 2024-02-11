import { React, useEffect, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import Success from '../components/Success'
import Warning from '../components/Warning'
import Loading from '../components/Loading';
import api from '../api_source'
import isOnline from '../utils/isOnline';
import Error from '../components/Error';




function Login(e) {
    const Isuser = localStorage.getItem('user')
    const redirect = useNavigate()
    const [email, SetEmail] = useState("")
    const [pass, Setpass] = useState("")
    const [hide, Sethide] = useState(true)
    const [err, Seterr] = useState(false)
    const [disable, SetDisable] = useState(false)
    const [loading, SetLoading] = useState(false)
    const networkStatus = isOnline()
    if (!networkStatus) {

        console.log("offline")
        return Error("you are offline")
    }
    // const loginHandle = async () => {
    //     if (!email || !pass) {
    //         Seterr(true)
    //         return Warning("All fiels are required")
    //     }
    //     else {

    //         SetDisable(true)
    //         SetLoading(true)
    //         try {

    //             if (!networkStatus) {
    //                 console.log("offline")
    //                 return Error("you are offline")
    //             }
    //             let result = await fetch(`${api}/login`, {
    //                 method: "post",
    //                 body: JSON.stringify({ email, pass }),
    //                 headers: { 'content-type': "application/json" }
    //             })
    //             result = await result.json()
    //             if (result.type == "success") {
    //                 localStorage.setItem("user", result.user)
    //                 SetLoading(false)
    //                 Success(result.type)
    //                 setTimeout(() => {
    //                     redirect('/dashboard')
    //                 }, 150)
    //             }
    //             else {
    //                 Warning(result.response);
    //                 // e.target.disabled = false
    //                 SetDisable(false)
    //                 SetLoading(false)
    //             }
    //         } catch (error) {
    //             console.log("Error=>", error);
    //             Error(error.message)
    //         }


    //     }
    // }
    const loginHandle = async () => {
        // Check for missing email or password
        if (!email || !pass) {
            Seterr(true);
            return Warning("All fields are required");
        }

        SetDisable(true);
        SetLoading(true);

        try {
            // Check for network status
            if (!networkStatus) {
                console.log("offline");
                return Error("You are offline");
                SetDisable(false);
            }

            // Attempt to log in
            const result = await fetch(`${api}/login`, {
                method: "post",
                headers: {
                    'Content-Type': "application/json",

                },
                credentials: "include",
                body: JSON.stringify({ email, pass }),



            });

            const parsedResult = await result.json();
            if (parsedResult.type === "error") {
                Error(parsedResult.message)
                SetLoading(false);
                SetDisable(false);
                return;
            }

            Success(parsedResult.message);

            if (parsedResult.type === "success") {
                localStorage.setItem("user", parsedResult.user);
                SetLoading(false);
                Success(parsedResult.message);

                // Redirect to the dashboard after a short delay
                setTimeout(() => {
                    redirect('/dashboard');
                }, 150);
                return;
            } else {
                Warning(parsedResult.response);
                SetDisable(false);
                SetLoading(false);
                SetDisable(false);
                return;
            }
        } catch (error) {
            console.error("Error:", error);
            Error(error.message);
            return;
        }
    };

    return (<>
        <Navbar />
        <div className="login-container">
            <ToastContainer />

            <div className='Login'>
                {loading && <Loading />}
                <h2>Login</h2>

                <input type="email" onChange={(e) => SetEmail(e.target.value)} placeholder='Email' />
                {(err && !email) ? <span style={{ color: "red" }}>Email Requires</span> : ""}


                <div className="pass">  <input type={hide ? "password" : 'text'} onChange={(e) => Setpass(e.target.value)} placeholder='password' />

                    <p> {hide ? <VisibilityOffIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer" }} /> :
                        <VisibilityIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer" }} />}</p>
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