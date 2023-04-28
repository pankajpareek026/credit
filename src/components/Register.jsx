import React,{useState} from 'react'
import validator from 'validator'
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar';
import Success from './Success';
import Warning from './Warning';
import Loader from './Loading';
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

    document.title = "C | REGISTER "
    const registerHandle = async (e) => {
        if (!name || !validator.isEmail(email) || !validator.isStrongPassword(pass) || !pass) {
            SetEmpty(true)
            return false;
        }
        else {

            e.target.disabled = true;
            SetDisabled(true)
            SetLoading(true)
            // call api 
            let result = await fetch('https://red-glamorous-scallop.cyclic.app/register', {
                method: "post",
                body: JSON.stringify({ name, email, pass }),
                headers: { 'content-type': 'application/json' }
            })
            result = await result.json()
            if (result.response === "success") {
                Success(result.response)
                setTimeout(() => {
                    redirect('/login')
                }, 1500)
            }
            else {
                Warning(result.response)
                // console.log(result)
                e.target.disabled = false;
                SetDisabled(false)
                SetLoading(false)
            }


        }
    }

    return (
        <>

            {Isuser ? redirect('/') :
                <> <Navbar />
                    <div className='Login'>
                        {loading&&<Loader/>}
                        <h2>Register</h2>
                        <input type="text" onChange={(e) => Setname(e.target.value)} placeholder='Full Name' />
                        {empty && !name && <span> Required</span>}
                        <input type="email" onChange={(e) => SetEmail(e.target.value)} placeholder='Email' />
                        {empty && !validator.isEmail(email) && <span>Invalid Email</span>}
                        <input type={hide ? "password" : "text"} onChange={(e) => { Setpass(e.target.value); SetSecure(validator.isStrongPassword(e.target.value)) }} placeholder='password' />
                        {hide ? <AiFillEyeInvisible onClick={() => Sethide((e) => !e)} style={{ fontSize: "x-large", marginLeft: "40%", marginTop: "-55px", cursor: "pointer" }} /> : <AiFillEye onClick={() => Sethide((e) => !e)} style={{ fontSize: "x-large", marginLeft: "40%", marginTop: "-55px", cursor: "pointer" }} />}
                        {empty && !pass && <span> Required</span>}
                        {pass && !secure && <span>weak password</span>}

                        <button className='reg-btn' style={{ backgroundColor: disabled && "gray" }} onClick={(e) => registerHandle(e)}>Register</button>
                        <p> Have an account  <Link to="/login">Login </Link>?</p>

                    </div>
                    <ToastContainer /></>}

        </>
    )
}
export default Register;
