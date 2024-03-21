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
import Loading from '../components/Loading';
import api from '../api_source'
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';
import WarningToast from '../components/WarningToast';
import ErrorToast from '../components/ErrorToast';
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
            return;
        }
        SetDisabled(true); // Disable form elements
        SetLoading(true); // Show loading spinner

        // Call the API to register
        fetch(`${api}/register`, {
            method: "post",
            body: JSON.stringify({ name, email, pass }),
            headers: { 'content-type': 'application/json' },
            credentials: "include",
            mode: 'cors'
        })
            .then(response => {
                // if (!response.ok) {
                //     return ErrorToast('Network Error');
                // }
                // console.log("response STS=>", response)
                return response.json();
            })
            .then(result => {
                console.log("rslt =>", result)
                if (result?.isSuccess) {
                    SuccessToast(result?.message); // Show success message
                    setTimeout(() => {
                        redirect('/login'); // Redirect to login page after a delay
                    }, 1500);
                    return
                }
                WarningToast(result.message); // Show warning message
                e.target.disabled = false; // Enable the button
                SetDisabled(false); // Enable form elements
                SetLoading(false); // Hide loading spinner

            })
            .catch(error => {
                return ErrorToast(error.message)
            })
            .finally(() => {
                SetDisabled(false); // Enable form elements
                SetLoading(false); // Hide loading spinner
            });

    };


    return (
        <>

            {Isuser ? redirect('/') :
                <> <Navbar />
                    <div className="login-container">
                        <Loading isSimpleLoading={true} isLoading={loading} />
                        <div className='Login'>

                            <h2>Register</h2>
                            <input type="text"
                                onKeyDown={(e) => { e.key == "Enter" && registerHandle(e) }}
                                onChange={(e) => Setname(e.target.value)}
                                placeholder='Full Name' />
                            <ErrorMessage show={(empty && !name)} message={"Name is Required"} />


                            <input
                                type="email"
                                onKeyDown={(e) => { e.key == "Enter" && registerHandle() }}
                                onChange={(e) => SetEmail(e.target.value)}
                                placeholder='Email' />
                            <ErrorMessage show={(empty && !validator.isEmail(email))} message={"Invalid Email"} />
                            <ErrorMessage show={(empty && !email)} message={"Email is Required"} />


                            <div className="pass" >
                                <input onKeyDown={(e) => { e.key == "Enter" && registerHandle() }}
                                    type={hide ? "password" : "text"}
                                    onChange={(e) => {
                                        Setpass(e.target.value);
                                        SetSecure(validator.isStrongPassword(e.target.value))
                                    }}
                                    placeholder='password' />
                                <p> {hide ? <VisibilityOffIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer" }} /> :
                                    <VisibilityIcon onClick={() => Sethide((e) => !e)} sx={{ fontSize: "x-large", cursor: "pointer" }} />}</p>
                            </div>
                            <ErrorMessage show={(empty && !pass)} message={"Password is Required"} />
                            <ErrorMessage show={(pass && !secure)} message={"weak password"} />


                            <button className='reg-btn' disabled={loading} style={{ backgroundColor: loading && "gray" }} onClick={(e) => registerHandle(e)}>Register</button>

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
