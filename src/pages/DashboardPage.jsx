import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdPersonSearch } from "react-icons/md";
import PieChart from "../components/pieChart";
import UserData from "../components/data";
import Client from "../components/Client";
import AdvanceNav from "../components/AdvanceNav";
import Warning from "../components/Warning";
import AddUser from "../components/AddUser";
import Loader from "../components/Loading";
import api from "../api_source";
import customSkeleton from "../mui_comps/CustomSkeleton";


const Dashboard = () => {
  let i = 0;
  document.title = "Credit | Dashboard";
  let date = new Date();
  // console.log(date);
  const today = date.toLocaleDateString("en-IN");
  // console.log(today);
  const Auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ApiUserData, setApiUserData] = useState([]);
  const [users, Setusers] = useState([]);
  const [total, SetTotal] = useState(0);
  const [min, SetMin] = useState({});
  const [max, SetMax] = useState({});
  const [notFound, SetnotFound] = useState(false);




  useEffect(() => {
    getUsers();
  }, []);



  const opt = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "Chart.js Doughnut Chart",
      },
    },
  };



  const searchHandle = async (e) => {
    const query = e.target.value;
    if (query === "") {
      SetnotFound(false);
      getUsers();
    } else {
      setLoading(true);
      let result = await fetch(`${api}/search`, {
        headers: {
          "content-type": "application/json",
          token: Auth,
          query,
        },
        credentials: "include"
      });
      result = await result.json();
      console.log("search result :", result);
      if (result.message == "success") {
        Setusers(result.responseData);
        setApiUserData([])
        setApiUserData(users.responseData);

        setLoading(false);

      } else if (result.message == "Not Found !") {
        SetnotFound(true);
      }
    }
  };



  const getUsers = async () => {
    let short = [];
    setLoading(true);
    if (Auth) {
      let users = await fetch(`${api}/clients`, {
        headers: {
          "content-type": "application/json",
          token: Auth,
        },
        credentials: "include"
      });
      users = await users.json();
      console.log("client data:", users);
      setApiUserData(users.responseData);
      console.table(users.responseData);
      setLoading(false);

      if (
        users.message === "invalid token" ||
        users.message === "jwt expired"
      ) {
        Warning(users.message);
        setLoading(false);
        localStorage.clear();
        navigate("/login");
      } else if (users.message == "Not Found !") {
        SetnotFound(true);
      } else {
        let userArray = []; // arrray to store data of all uset for sorting
        t = 0;
        users.responseData.map((element) => {
          userArray.push(element);
          t = t + element.totalAmount;
        });
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

        SetMax(userArray[0]);
        SetMin(userArray[len - 1]);
        SetTotal(t);
        Setusers(users.responseData);
        //setLoading(false)
      }
    } else {
      // console.log("err");
    }
  };



  const [userData, setUserData] = React.useState({
    labels: UserData.map((data) => data.user),
    datasets: [
      {
        label: "DEBITORS/CREDITORS",
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



  let t = 0;
  // console.log("condition :", (!notFound || users.length == 0));
  // get all users
  return (
    <div className="dashboard">
      <AdvanceNav refresh={getUsers} isDashboard={true} isAddUser={true} />

      <div className="right">
        {" "}
        {/* right side container which containes the compnets of dashboard*/}
        <div className="upper-container">
          {" "}
          {/* container for heading search and generate report*/}
          <h2 className="heading">Dasboard</h2> {/* dashboard heading*/}
          <MdPersonSearch className="search-p" /> {/* search icon*/}
          <input
            type="search"
            onChange={searchHandle}
            placeholder="Search User"
          />
          {/*searchbar to search users*/}
          <button className="generateR">Generate Report</button>
        </div>


        <div className="d-container2">
          {" "}
          {/* contains overviw and chart sections */}
          <div className="d-overview">
            <div className="d-balance">
              <p
                style={{
                  position: "abslute",
                  backgroundColor: "lightgray",
                  color: "black",
                  padding: "5px 7px",
                  borderRadius: "5px",
                  float: "right",
                  margin: "-5px -3px",
                  fontWeight: "900",
                  fontSize: "x-small",
                }}
              >
                Balance
              </p>
              ₹ {total}
            </div>

            <div className="d-hl-container">
              <div className="d-high">
                {/*user has higest credit */}
                <p>Max</p>
                <div>
                  <span>{max ? max.name : "NA"}</span>
                  <span style={{ color: "red" }}>
                    ₹ {min ? max.totalAmount : 0}
                  </span>
                </div>
              </div>

              <div className="d-low">
                {/*user has lowest credit */}
                <p>Min</p>
                <div>
                  <span>{min ? min.name : "NA"}</span>
                  <span style={{ color: "green" }}>
                    ₹ {min ? min.totalAmount : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="d-chart">
            {ApiUserData.length > 0 ? (
              <PieChart
                chartData={userData}
                options={opt}
                style={{ hight: "500px" }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="d-clients-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {/* <h5>USERS</h5> */}
              {notFound ? (
                <>
                  <tr style={{ backgroundColor: "red" }}>
                    <td
                      style={{
                        color: "black",
                        backgroundColor: "orange",
                        fontWeight: "900",
                      }}
                    >
                      {" "}
                      ! USER
                    </td>
                    <td
                      style={{
                        color: "black",
                        backgroundColor: "orange",
                        fontWeight: "900",
                      }}
                    >
                      NOT FOUND
                    </td>
                    <td
                      style={{
                        color: "black",
                        backgroundColor: "orange",
                        fontWeight: "900",
                      }}
                    >
                      <AddUser refresh={getUsers} />{" "}
                    </td>
                  </tr>
                </>
              ) : users.length == 0 ? (
                <>
                  <tr style={{ backgroundColor: "red" }}>
                    <td
                      style={{
                        color: "black",
                        backgroundColor: "orange",
                        fontWeight: "900",
                      }}
                    >
                      {" "}
                      ! NO
                    </td>
                    <td
                      style={{
                        color: "black",
                        backgroundColor: "orange",
                        fontWeight: "900",
                      }}
                    >
                      User{" "}
                    </td>
                    <td
                      style={{
                        color: "black",
                        backgroundColor: "orange",
                        fontWeight: "900",
                      }}
                    >
                      <AddUser refresh={getUsers} />{" "}
                    </td>
                  </tr>
                </>
              ) : (
                <>

                  {users.map((user, index) => {
                    //   SetTotal(user.totalAmount)
                    // console.log("USER :", user);
                    if (loading) {
                      return (
                        // 
                        <customSkeleton />
                      )
                    }
                    return (
                      <Client
                        key={index}
                        lastDate={
                          user?.lastDate.length > 0 /*to check is a date */
                            ? new Date(user.lastDate).toLocaleDateString(
                              "en-IN"
                            )
                            : today
                        }
                        name={user.name}
                        amount={user.totalAmount}
                        Id={user._id}
                      >
                        {" "}
                      </Client>
                    );
                  })}


                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
