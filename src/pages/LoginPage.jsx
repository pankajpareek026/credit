import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loading from '../components/Loading';
import api from '../api_source'
import isOnline from '../utils/isOnline';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/reducers/authSlice';
import ErrorMessage from '../components/ErrorMessage';
import ErrorToast from '../components/ErrorToast';
import WarningToast from '../components/WarningToast';
import SuccessToast from '../components/SuccessToast';
import { ToastContainer } from 'react-toastify';
import validator from 'validator';






function Login(e) {
    const redirect = useNavigate()
    const [email, SetEmail] = useState("")
    const [pass, Setpass] = useState("")
    const [hide, Sethide] = useState(true)
    const [err, Seterr] = useState(false)
    const [disable, SetDisable] = useState(false)
    const [loading, SetLoading] = useState(false)
    const [isInvalidEmail, SetIsInvalidEmail] = useState(false)
    const networkStatus = isOnline()

    const dipatch = useDispatch()
    if (!networkStatus) {

        console.log("offline")
        return ErrorToast("you are offline")
    }

    const loginHandle = async () => {
        // check if email is valid
        SetIsInvalidEmail(!validator.isEmail(email))
        // Check if the email or password fields are empty
        if (!email || !pass) {
            Seterr(true); // Set an error state
            return WarningToast("All fields are required"); // Let the user know that all fields are required
        }
        if (isInvalidEmail) {
            ErrorToast("Invalid email")
            return
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
            SetLoading(true)
            // Attempt to log in by sending a request to the server
            fetch(`${api}/login`, {
                method: "post",
                headers: {
                    'Content-Type': "application/json", // Set the content type of the request
                },
                credentials: "include",// Include credentials such as cookies in the request
                mode: 'cors',
                body: JSON.stringify({ email, pass }), // Convert the email and password to JSON format and send it in the request body
            })
                .then(response => response.json()) // Parse the response from the server as JSON
                .then((apiResult) => {
                    if (apiResult.isError) {
                        // If there's an error response from the server
                        ErrorToast(apiResult?.responseData.message); // Show the error message to the user
                        SetLoading(false); // Hide the loading spinner
                        SetDisable(false); // Enable the form elements for user interaction
                        return;
                    }

                    SuccessToast(apiResult?.message); // Show the success message to the user

                    if (apiResult.isSuccess && apiResult.responseData !== undefined) {
                        // If the login attempt is successful
                        localStorage.setItem("user", apiResult.responseData.user); // Store user data in local storage

                        SetLoading(false); // Hide the loading spinner

                        SuccessToast(apiResult?.message); // Show the success message to the user

                        dipatch(setCredentials({ token: apiResult.responseData?.user, status: true }))
                        // Redirect to the dashboard page after a short delay

                        setTimeout(() => {
                            redirect('/dashboard');
                        }, 150);
                        return
                    }
                    // If the server response type is unknown
                    WarningToast(apiResult.message); // Show a warning message to the user
                    SetDisable(false); // Enable the form elements for user interaction


                }).catch((error) => ErrorToast(error.message))
                .finally(() => {
                    SetDisable(false)
                    SetLoading(false) // Hide
                })

        } catch (error) {
            // If an unexpected error occurs during the login process
            console.error("Error:", error); // Log the error message to the console for debugging
            ErrorToast(error.message); // Show the error message to the user
        }
    };


    return (<>

        <Navbar />
        <div className="login-container">
            <Loading isSimpleLoading={true} isLoading={loading} />
            <ToastContainer />

            <div className='Login'>
                <h2>Login</h2>
                {/* input box for email */}
                <input type="email"
                    value={email}
                    onChange={(e) => SetEmail(e?.target?.value)}
                    onKeyDown={(e) => { e.key === "Enter" && loginHandle() }}
                    placeholder='Email' />
                <ErrorMessage show={(err && !email)} message={"Email is Required"} />
                <ErrorMessage show={(err && email && !validator.isEmail(email))} message={"Invalid Email"} />

                {/* input box for password */}
                <div className="pass">
                    <input type={hide ? "password" : 'text'}
                        value={pass}
                        onChange={(e) => Setpass(e.target.value)}
                        onKeyDown={(e) => { e.key === "Enter" && loginHandle() }}
                        placeholder='password' />
                    <p> {hide ?
                        <VisibilityOffIcon
                            onClick={() => Sethide((e) => !e)}
                            sx={{ fontSize: "x-large", cursor: "pointer" }}
                        /> :
                        <VisibilityIcon
                            onClick={() => Sethide((e) => !e)}
                            sx={{ fontSize: "x-large", cursor: "pointer" }}
                        />}</p>
                </div>
                <ErrorMessage show={(err && !pass)} message={"Password is Required"} />


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