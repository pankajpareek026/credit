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

    const loginHandle = async () => {
        // Check if the email or password fields are empty
        if (!email || !pass) {
            Seterr(true); // Set an error state
            return Warning("All fields are required"); // Let the user know that all fields are required
        }

        SetDisable(true); // Disable the form elements to prevent multiple submissions
        SetLoading(true); // Show a loading spinner to indicate that something is happening

        try {
            // Check if the network connection is available
            if (!networkStatus) {
                console.log("You are offline"); // Log a message indicating offline status
                SetDisable(false); // Enable the form elements for user interaction
                SetLoading(false); // start loading 
                return Error("You are offline"); // Inform the user that they are offline

            }

            // Attempt to log in by sending a request to the server
            fetch(`${api}/login`, {
                method: "post",
                headers: {
                    'Content-Type': "application/json", // Set the content type of the request
                },
                credentials: "include", // Include credentials such as cookies in the request
                body: JSON.stringify({ email, pass }), // Convert the email and password to JSON format and send it in the request body
            })
                .then(response => response.json()) // Parse the response from the server as JSON
                .then((apiResult) => {
                    if (apiResult.type === "error") {
                        // If there's an error response from the server
                        Error(apiResult.message); // Show the error message to the user
                        SetLoading(false); // Hide the loading spinner
                        SetDisable(false); // Enable the form elements for user interaction
                        return;
                    }

                    Success(apiResult.message); // Show the success message to the user

                    if (apiResult.type === "success") {
                        // If the login attempt is successful
                        localStorage.setItem("user", apiResult.user); // Store user data in local storage
                        SetLoading(false); // Hide the loading spinner
                        Success(apiResult.message); // Show the success message to the user

                        // Redirect to the dashboard page after a short delay
                        setTimeout(() => {
                            redirect('/dashboard');
                        }, 150);
                        return
                    }
                    // If the server response type is unknown
                    Warning(apiResult.response); // Show a warning message to the user
                    SetDisable(false); // Enable the form elements for user interaction
                    SetLoading(false); // Hide the loading spinner

                }).catch((error) => Error(error.message))
                .finally(() => {
                    SetDisable(false)
                    SetLoading(false) // Hide
                })

        } catch (error) {
            // If an unexpected error occurs during the login process
            console.error("Error:", error); // Log the error message to the console for debugging
            Error(error.message); // Show the error message to the user
        }
    };


    return (<>

        <Navbar />
        <div className="login-container">
            {loading && <Loading />}
            <ToastContainer />

            <div className='Login'>

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