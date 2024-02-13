import React, { useState } from 'react'
import validator from 'validator'
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
//mui icons --start
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// mui icons --end
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Success from '../components/Success';
import Warning from '../components/Warning';
import Loader from '../components/Loading';
import api from '../api_source'
import Error from '../components/Error';
// import Alert from  './Alert.js'
// import { json } from 'body-parser';
function Register() {
    const Isuser = localStorage.getItem('user')
    const redirect = useNavigate()
    const [name, Setname] = React.useState("")
    const [email, SetEmail] = React.useState("")
    const [pass, Setpass] = React.useState("")
    const [empty, SetEmpty] = React.useState(false)
    const [secure, SetSecure] = React.useState(true)
    const [disabled, SetDisabled] = React.useState(false)
    const [hide, Sethide] = React.useState(true)
    const [loading, SetLoading] = useState(false)

    document.title = "Credit | REGISTER "
    const registerHandle = (e) => {
        if (!name || !validator.isEmail(email) || !validator.isStrongPassword(pass) || !pass) {
            SetEmpty(true); // Set empty state to true
            return; // Return a resolved promise with false value
        }
        e.target.disabled = true; // Disable the button
        SetDisabled(true); // Disable form elements
        SetLoading(true); // Show loading spinner

        // Call the API to register
        return fetch(`${api}/register`, {
            method: "post",
            body: JSON.stringify({ name, email, pass }),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result.type === "success") {
                    Success(result.message); // Show success message
                    setTimeout(() => {
                        redirect('/login'); // Redirect to login page after a delay
                    }, 1500);
                } else {
                    Warning(result.message); // Show warning message
                    e.target.disabled = false; // Enable the button
                    SetDisabled(false); // Enable form elements
                    SetLoading(false); // Hide loading spinner
                }
            })
            .catch(error => {
                Error(error.message)
                console.error("Error:", error); // Log any errors that occur during the process
                // Handle error as per requirement
            })
            .finally(() => {
                e.target.disabled = false; // Enable the button
                SetDisabled(false); // Enable form elements
                SetLoading(false); // Hide loading spinner
            });

    };


    return (
        <>

            {Isuser ? redirect('/') :
                <> <Navbar />
                    <div className="login-container">
                        {loading && <Loader />}
                        <div className='Login'>

                            <h2>Register</h2>
                            <input type="text" onChange={(e) => Setname(e.target.value)} placeholder='Full Name' />
                            {empty && !name && <span> Required</span>}

                            <input type="email" onChange={(e) => SetEmail(e.target.value)} placeholder='Email' />
                            {empty && !validator.isEmail(email) && <span>Invalid Email</span>}

                            <div className="pass"> <input type={hide ? "password" : "text"} onChange={(e) => { Setpass(e.target.value); SetSecure(validator.isStrongPassword(e.target.value)) }} placeholder='password' />

                                <p> {hide ? <VisibilityOffIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer" }} /> :
                                    <VisibilityIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer" }} />}</p>
                            </div>
                            {empty && !pass && <span> Required</span>}
                            {pass && !secure && <span>weak password</span>}

                            <button className='reg-btn' style={{ backgroundColor: disabled && "gray" }} onClick={(e) => registerHandle(e)}>Register</button>
                            <p> Have an account  <Link to="/login">Login </Link>?</p>

                        </div>
                    </div>
                    <ToastContainer />
                </>
            }

        </>
    )
}
export default Register;
