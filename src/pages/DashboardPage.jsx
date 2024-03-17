import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdPersonSearch } from "react-icons/md";
import PieChart from "../components/pieChart";
import Client from "../components/Client";
import AdvanceNav from "../components/AdvanceNav";
import AddUser from "../components/AddUser";
import api from "../api_source";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { logout } from "../features/reducers/authSlice";
import ErrorToast from "../components/ErrorToast";
import WarningToast from "../components/WarningToast";
import FilterButton from "../components/FiltersButton";


const Dashboard = () => {
  document.title = "Credit | Dashboard";
  const date = new Date().toLocaleDateString("en-IN");
  const Auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchLoaing, setSearchLoaing] = useState(false);
  const [ApiUserData, setApiUserData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [showFilters, setShowFilters] = useState(false);
  const [users, Setusers] = useState([]);
  const [total, SetTotal] = useState(0);
  const [min, SetMin] = useState({});
  const [max, SetMax] = useState({});
  const [notFound, SetnotFound] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    getUsers(true);
  }, []);

  useEffect(() => {
    setUserData({
      ...userData,
      labels: users.length > 0 ? users?.map((data) => data.name) : [],
      datasets: [
        {
          ...userData.datasets[0],
          data: users.length > 0 ? users?.map((data) => data.balance) : [],
        },
      ],
    });
  }, [users]);

  const opt = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // This hides the legend
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  // search lients
  const searchHandle = async (e) => {
    const query = e.target.value
    try {
      if (query === "") {
        SetnotFound(false);
        getUsers(false);
        return
      }
      setSearchLoaing(true);
      setShowFilters(false)
      setIsFilterApplied(false);
      fetch(`${api}/search`, {
        method: 'GET',
        headers: {
          "content-type": "application/json",
          token: Auth,
          query,
        },
        credentials: "include"
      }).then(res => res.json())
        .then((result) => {
          if (result.isSuccess) {
            Setusers(result.responseData);
            // setApiUserData([]);
            setApiUserData(users.responseData);
            setSearchLoaing(false);
            return
          }


          if (result.message === "Not Found !") {
            SetnotFound(true);
            Setusers([]);
            setApiUserData([]);
            setApiUserData([])
          }
          return ErrorToast(result.message);
        }).catch((error) => {
          ErrorToast(error.message)
        }).finally(() => {
          setSearchLoaing(false)
        })

    } catch (error) {
      WarningToast("An error occurred. Please try again.");
    }
  };



  // get all clients
  const getUsers = (startLoading = false) => {
    startLoading && setLoading(true);
    if (Auth) {
      fetch(`${api}/clients`, {
        headers: {
          "content-type": "application/json",
          token: Auth,
        },
        credentials: "include"
      })
        .then(response => {
          if (!response.ok) {
            return ErrorToast('Network response was not ok');
          }
          return response.json();
        })
        .then(users => {
          setApiUserData(users.responseData);

          if (users.message === "invalid token" || users.message === "jwt expired") {
            WarningToast(users.message);
            localStorage.clear();
            dispatch(logout())
            navigate("/login");
            return
          } if (users.message === "Not Found !") {
            SetnotFound(true);
            return
          }

          let userArray = users.responseData.slice();
          let totalAmount = userArray.reduce((acc, curr) => acc + curr.balance, 0);
          userArray.sort((a, b) => a.balance - b.balance);
          SetMax(userArray[0]);
          SetMin(userArray[userArray.length - 1]);
          SetTotal(totalAmount);
          Setusers(userArray);

        })
        .catch(error => {
          ErrorToast(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      return;
    }
  };

  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [
          'rgba(75, 192, 192, 1)',
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(255, 159, 64)',
          'rgb(153, 102, 255)',
          'rgb(255, 0, 255)',
          'rgb(0, 255, 255)',
          'rgb(255, 0, 0)',
          'rgb(0, 255, 0)',
          'rgb(0, 0, 128)',
          'rgb(255, 255, 255)',
          'rgb(255, 255, 0)'
        ],
        borderColor: "black",
        borderWidth: 0.5,
      },
    ],
  });

  const sortByAmount = () => {

  }
  const sortByNameHandle = () => {

  }

  return (

    <div className="dashboard profile">

      <Loading isLoading={loading} isFullPageLoading={true} />
      <Loading isLoading={searchLoaing} isFullPageLoading={false} isSimpleLoading={true} />
      <AdvanceNav refresh={getUsers} isDashboard={true} isAddUser={true} />

      <div className="right">

        <div className="upper-container">
          <h2 className="heading">Dasboard</h2>

          <div className="search-container">
            <MdPersonSearch className="search-p" />
            <input
              type="search"
              onChange={searchHandle}
              placeholder="Search User"
            />
          </div>
          {/* <button className="generateR"> Report</button> */}
        </div>


        <div className="d-container2">

          <div className="d-overview">
            <div className="d-balance">
              <p
                style={{
                  position: "absolute",
                  backgroundColor: "lightgray",
                  color: "black",
                  padding: "5px 7px",
                  borderRadius: "5px",
                  float: "right",
                  margin: "-5px -3px",
                  fontWeight: "900",
                  fontSize: "x-small",
                  position: "static",
                }}
              >
                Balance
              </p>
              ₹ {total ? parseFloat(total).toFixed(2) : 0.00}
            </div>
            <div className="d-hl-container">
              <div className="d-high">
                <p>Max</p>
                <div>
                  <span>{max ? max.name : "NA"}</span>
                  <span style={{ color: "red" }}>
                    ₹ {min ? parseFloat(max.balance).toFixed(2) : 0.00}
                  </span>
                </div>
              </div>
              <div className="d-low">
                <p>Min</p>
                <div>
                  <span>{min ? min.name : "NA"}</span>
                  <span style={{ color: "green" }}>
                    ₹ {min ? parseFloat(min.balance).toFixed(2) : 0.00}
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div className="d-chart">
            {users.length > 0 && (
              <PieChart
                chartData={userData}
                options={opt}
                style={{ hight: "100%" }}
              />
            )}
          </div>


        </div>


        <div className="sort-by-and-add-user-container">
          <FilterButton setIsFiltersApplied={setIsFilterApplied} setShowFilters={setShowFilters} setFilteredData={setFilterData} showFilters={showFilters} unFilteredData={ApiUserData} />
          <AddUser refresh={getUsers} />
        </div>


        <div className="d-clients-container">

          <table>
            {/* display headers only if any cliet exists */}
            {
              users?.length > 0 && <thead>
                <tr>
                  <th style={{ cursor: "pointer" }} onClick={sortByNameHandle}>Name</th>
                  <th>Date</th>
                  <th style={{ cursor: "pointer" }} onClick={sortByAmount}>Amount</th>
                </tr>
              </thead>
            }

            <tbody>
              {/* Display custom message if clients not found */}
              {notFound ? (
                <tr style={{ backgroundColor: "red" }}>
                  <Client isClickDisabled={true} name={"Client Not Found!"} />
                </tr>
              ) : users?.length === 0 ? (
                // Display message if no clients found
                <Client isClickDisabled={true} name={"Client Not Found!"} />
              ) : isFilterApplied ? (
                filterData.map((user, index) => (
                  <Client
                    isClientComponent={true}
                    key={index}
                    lastDate={
                      user?.lastDate.length > 0
                        ? new Date(user.lastDate).toLocaleDateString("en-IN")
                        : date
                    }
                    name={user.name}
                    amount={user.balance}
                    Id={user._id}
                  />
                ))
              ) : (
                // Display clients
                <>
                  {users?.map((user, index) => (
                    <Client
                      isClientComponent={true}
                      key={index}
                      lastDate={
                        user?.lastDate.length > 0
                          ? new Date(user.lastDate).toLocaleDateString("en-IN")
                          : date
                      }
                      name={user.name}
                      amount={user.balance}
                      Id={user._id}
                    />
                  ))}
                </>
              )}
            </tbody>



          </table>
        </div>
      </div>
    </div >

  );
};

export default Dashboard;
