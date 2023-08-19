import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
//react icons --start
import { FaPowerOff } from "react-icons/fa";
import { SiAddthis } from "react-icons/si";
import { MdSpaceDashboard } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FaShareAlt } from "react-icons/fa";
//react icons --end


//mui icons  --start
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PostAddIcon from '@mui/icons-material/PostAdd';
//mui icons --end

import TransactionComp from './TransactionComp';
import NewTransaction from './NewTransaction';
import Swal from 'sweetalert2';
import Success from './Success';
import api from '../api_source'

const Transactions = () => {
    let balance = 0
    useEffect(() => {
       
        getTransactions();
       
           });
    
    const redirect = useNavigate()
    const params = useParams()
    const [show, Setshow] = useState(false)
    const [trn, Settrn] = useState([]); //array for transactions
    const [blance, Setbalance] = useState(0)
    const [name, Setname] = useState("")
    const Thandle=()=> {
        Setshow(true)
    }
    const auth = localStorage.getItem('user')
    const getTransactions = async () => {
        let result = await fetch(`${api}/client/transactions`, {
            headers: {
                uid: params.id,
                token: auth,
            }
        })
        result = await result.json()
        Setname(result.response[0].name); /* Set the name of user at top and in header section in transactions component */
        Settrn(result.response[0].transactions) ;/* All transaction related to the user  */
        result.response[0].transactions.map((item, index) => {
    
           return  balance += item.amount;  
        })
        Setbalance(balance)
    }
    
    document.title = `Credit | Transaction / ${name}`
    const searchHandle = async (e) => {
        
        let query = e
        let result = fetch('https://red-glamorous-scallop.cyclic.app/client/search', {
            headers: {
                "content-type": "application/json",
                token: auth,
                id: params.id,
                query
            }
        })
        result = await result.json()
       console.log(result)


    }
    const logout = () => {
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
                Success(`Logged Out`)
                setTimeout(() => {
                    redirect('/login')
                }, 1200);
            }
        })

    }
    return (
        <div  className='transactions'>

            <div className="left">
                {/* for navbar in left side */}
                <h2 className="logo small">C</h2>

                <Link style={{ fontSize: "x-large " }} to="/" ><HomeIcon fontSize="large" style={{ fontSize: "x-large!important" }} /></Link>
                {/* <Link style={{ fontSize: "x-large " }} to='/user'><AccountCircleIcon  fontSize="large"style={{ fontSize: "x-large!important" }} /></Link> */}
                <Link style={{ fontSize: "x-large " }} to='/dashboard'><DashboardIcon  fontSize="large"style={{ fontSize: "x-large!important" }} /></Link>
                <Link style={{ fontSize: "x-large" }} onClick={Thandle}  ><PostAddIcon fontSize="large"  /></Link>
                <div style={{ fontSize: "x-large " }} className="d-logout" onClick={logout}>
                    <PowerSettingsNewIcon  fontSize="large" onClick={logout} onTouchStart={logout} style={{ hover: { color: "red" } }}/>
                </div>
            </div>

            <div className="t-right">
                <div className="t-upper-container">
                    <div style={show?{filter: "blur(.7px)"}:{}} className="t-username">{name}</div>
                    <input style={show?{filter: "blur(3px)"}:{}} type="search" placeholder='Search Transaction ' onChange={(e) => searchHandle(e.target.value)} />
                    <div className="share">
                        <FaShareAlt />
                    </div>
                </div>
                <div style={show?{filter: "blur(3px)"}:{}} className="t-container2">

                    <div style={show?{filter: "blur(3px)"}:{}} className="t-heading">
                        <span className="t-user-name"> {name} </span>
                        <span className="t-lastdate"> { }</span>
                        <span className="t-balance"> ₹ {blance}</span>
                    </div>

                    {
                        // to map transaction at Transaction Component
                        trn.map((item, index) => {
                            let D=new Date(item.date)
                            D=D.toLocaleString("en-IN")
                            return (<TransactionComp key={index} show={show} amount={item.amount} dis={item.dis} type={item.type}  date={D} />)
                        })
                    }
                </div>
            </div>
            {show && <NewTransaction show={show} refresh={getTransactions} Thandle={Thandle}   uid={params.id} Setshow={Setshow} />}
        </div>
    )
}

export default Transactions;
