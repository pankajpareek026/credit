import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdPersonSearch } from "react-icons/md";
import PieChart from './pieChart';
import UserData from './data'
import Client from './Client';
import AdvanceNav from './AdvanceNav';
import Warning from './Warning';
const Dashboard = () => {
    document.title = "C | Dashboard"
    const Auth = localStorage.getItem('user')
    const navigate = useNavigate()
    useEffect(() => {
        getUsers()
    }, [])
    const [total, SetTotal] = useState(0)
    const [min, SetMin] = useState({})
    const [max, SetMax] = useState({})
    const [notFound, SetnotFound] = useState(false)
    const opt = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: 'Chart.js Doughnut Chart'
            }
        }
    }
    const searchHandle = async (e) => {
        const query = e.target.value
        if (query === "") {
            SetnotFound(false)
            getUsers()
        }
        else {

            let result = await fetch('http://localhost:2205/search', {
                headers: {
                    "content-type": "application/json",
                    token: Auth,
                    query
                }
            })
            result = await result.json()
            console.table(result.response)
            if (result.response !== "Not Found !") {
                console.log("true")
                Setusers(result.response)
            }
            else if (result.response == "Not Found !") {
                SetnotFound(true)

            }
        }
    }
    const getUsers = async () => {
        let short = []

        if (Auth) {
            let users = await fetch("http://localhost:2205/clients", {
                headers: {
                    "content-type": "application/json",
                    token: Auth
                }
            })
            users = await users.json()
            if (users.response === "invalid token") {
                Warning("session expired !")
                localStorage.clear()
                navigate('/login')
            }
            else if (users.response == "Not Found !") {
                SetnotFound(true)
            }
            else {
                let userArray = [] // arrray to store data of all uset for sorting 
                t = 0;
                users.response.map((element) => {
                    userArray.push(element)
                    t = t + element.totalAmount;
                    console.log("user Array :", userArray);
                })
                //sort array to find out maximum and minimum amount
                let len = userArray.length;
                for (var i = 0; i <= len - 1; i++) {
                    for (var j = i + 1; j < len; j++) {
                        if (userArray[j].totalAmount < userArray[i].totalAmount) {
                            let t = userArray[j];
                            userArray[j] = userArray[i];
                            userArray[i] = t;

                        }
                    }

                }
                console.table(userArray)
                SetMax(userArray[0])
                SetMin(userArray[len - 1])
                SetTotal(t)
                Setusers(users.response)
            }
            console.log(short)
        }
        else {
            console.log("err")
        }
    }
    const [users, Setusers] = useState([])
    //   ChartJS.defaults.global.legend.display = false;
    const [userData, setUserData] = React.useState({
        labels: UserData.map((data) => data.user),
        datasets: [
            {
                label: "DEBITORS",
                data: UserData.map((data) => data.amount),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "orange",
                    "#50AF95",
                    "#f3ba2f",
                    "red",
                ],
                borderColor: "black",
                borderWidth: 0.5,
            },
        ],
    });
    let t = 0
    // get all users
    return (
        <div className='dashboard'>
            <AdvanceNav refresh={getUsers} />
            <div className="right"> {/* right side container which containes the compnets of dashboard*/}
                <div className="upper-container"> {/* container for heading search and generate report*/}
                    <h2 className="heading">Dasboard</h2> {/* dashboard heading*/}
                    <MdPersonSearch className='search-p' /> {/* search icon*/}
                    <input type="search" onChange={searchHandle} placeholder='Search User' />{/*searchbar to search users*/}
                    <button className='generateR'>Generate Report</button>
                </div>
                <div className="d-container2"> {/* contains overviw and chart sections */}
                    <div className="d-overview">
                        <div className="d-balance">
                            <p style={{ position: "abslute", backgroundColor: "lightgray", color: "black", padding: "5px 7px", borderRadius: "5px", float: "right", margin: "-5px -3px", fontWeight: "900", fontSize: "x-small" }}>Balance</p>
                            ₹ {total}
                        </div>
                        <div className="d-hl-container">
                            <div className="d-high">
                                {/*juser has higest credit */}
                                <p style={{ position: "abslute", backgroundColor: "gray", color: "black", padding: "5px 7px", borderRadius: "100px", float: "right", margin: "0", top: 0, fontWeight: "900", fontSize: "x-small" }}>Max</p>
                                <div style={{ display: "inline-flex", gap: "5px" }}><span>{max.name}</span> <span style={{ color: "red" }}>₹ {max.totalAmount}</span></div></div>
                            <div className="d-low">
                                {/*juser has lowest credit */}
                                <p style={{ position: "relative", backgroundColor: "gray", color: "black", padding: "5px 7px", borderRadius: "100px", float: "right", margin: "0", button: "50px", fontWeight: "900", fontSize: "x-small" }}>Min</p>
                                <div><span style={{ position: "static" }}>{min.name}</span> <span style={{ color: "green" }}>₹ {min.totalAmount}</span></div></div>
                        </div>
                    </div>
                    <div className="d-chart">
                        <PieChart chartData={userData} options={opt} style={{ hight: "500px" }} />
                    </div>
                </div>
                <div className="d-clients-container">
                    <h5>USERS</h5>
                    {!notFound > 0 ?
                        <>
                            {users.map((user, index) => {
                                //   SetTotal(user.totalAmount)
                                return (<Client key={index} name={user.name} amount={user.totalAmount} Id={user._id}> </Client>)
                            })}</> : <h2>
                            <img className='nothing' src="https://i.ibb.co/K5CrdDT/error.png" alt="" />                           </h2>
                    }
                </div>
            </div>
        </div>
    )
}
export default Dashboard;