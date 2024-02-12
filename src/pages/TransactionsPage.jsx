import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

//mui icons  --start
import ShareIcon from "@mui/icons-material/Share";
import HomeIcon from "@mui/icons-material/Home";
import { RingLoader } from "react-spinners";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PostAddIcon from "@mui/icons-material/PostAdd";
//mui icons --end

import TransactionComp from "../components/TransactionComp";
import NewTransaction from "../components/NewTransaction";
import Swal from "sweetalert2";
import Success from "../components/Success";
import api from "../api_source";
import Dialog from "../components/Dialog";
import Loading from "../components/Loading";

const Transactions = () => {
  let balance = 0;
  const redirect = useNavigate();
  let params = useParams();
  const [show, Setshow] = useState(false);
  const [transactions, SetTransactions] = useState([]); //array for transactions
  const [blance, Setbalance] = useState(0);
  const [name, Setname] = useState("");
  const [shareData, setShareData] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  let currentBalance = 0
  const Thandle = () => {
    Setshow((position) => !position);
  };

  useEffect(() => {
    getTransactions();
  }, []);


  const auth = localStorage.getItem("user");
  const getTransactions = async () => {
    try {
      let result = await fetch(`${api}/client/transactions`, {
        headers: {
          uid: params.id,
          token: auth,
        },
        credentials: "include"
      });
      result = await result.json();

      const { name, transactions } = result.type == "success" ? result.responseData : { name: "", transactions: [] }

      Setname(name); /* Set the name of user at top and in header section in transactions component */

      SetTransactions(transactions); /* All transaction related to the user  */

      transactions?.map((item, index) => {
        return (balance += item?.amount);
      });
      Setbalance(balance);
    } catch (error) {
      Error(error.message)
    }
  };

  document.title = `Credit | Transaction / ${name}`;

  // api request for share transactions detail
  const getTransactionsLink = async () => {
    console.log("transaction is running :>");
    try {
      setRequestSent(true);
      fetch(`${api}/shareRequest`, {
        method: "post",
        headers: {
          "content-type": "application/json",
          token: auth.toString(),
        },
        credentials: "include",
        body: JSON.stringify({
          clientId: params.id.toString(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("share Link :", data);
          setRequestSent(false);
          setShareData(data);
          setIsOpened(true);
        });
    } catch (error) {
      console.log("share :", error);
    }
  };

  const searchHandle = async (e) => {
    let query = e;
    let result = fetch(`${api}/client/search`, {
      headers: {
        "content-type": "application/json",
        token: auth,
        id: params.id,
        query,
      },
      credentials: "include"
    });
    result = await result.json();
    console.log(result);
  };

  const logout = () => {
    Swal.fire({
      title: "Logout",
      icon: "warning",
      background: "black",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout ",
      innerWidth: "200px",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Success(`Logged Out`);
        setTimeout(() => {
          redirect("/login");
        }, 1200);
      }
    });
  };
  return (
    <div className="transactions">
      <div className="left">
        {/* for navbar in left side */}
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => redirect("/")}
          className="logo small"
        >
          C
        </h2>

        <Link style={{ fontSize: "x-large " }} to="/">
          <HomeIcon
            fontSize="large"
            style={{ fontSize: "x-large!important" }}
          />
        </Link>
        <Link style={{ fontSize: "x-large " }} to='/me'><AccountCircleIcon fontSize="large" style={{ fontSize: "x-large!important" }} /></Link>
        <Link style={{ fontSize: "x-large " }} to="/dashboard">
          <DashboardIcon
            fontSize="large"
            style={{ fontSize: "x-large!important" }}
          />
        </Link>
        <Link style={{ fontSize: "x-large" }} onClick={Thandle}>
          <PostAddIcon fontSize="large" />
        </Link>
        <div
          style={{ fontSize: "x-large " }}
          className="d-logout"
          onClick={logout}
        >
          <PowerSettingsNewIcon
            fontSize="large"
            onClick={logout}
            onTouchStart={logout}
            style={{ hover: { color: "red" } }}
          />
        </div>
      </div>

      <div className="t-right">
        {shareData && (
          <Dialog
            isOpened={isOpened}
            onClose={() => setIsOpened(false)}
            link={shareData?.link}
            message={shareData["message "]}
          />
        )}

        <div className="t-upper-container">
          <div
            style={show ? { filter: "blur(.7px)" } : {}}
            className="t-username"
          >
            {name}
          </div>
          <input
            style={show ? { filter: "blur(3px)" } : {}}
            type="search"
            placeholder="Search Transaction "
            onChange={(e) => searchHandle(e.target.value)}
          />
          <button onClick={getTransactionsLink} className="share">
            {requestSent ? <Loading margin={{ margin: 0, color: 'green' }} /> : <ShareIcon sx={{ color: "rgb(20, 241, 149)", fontsize: "30px" }} />}
          </button>
        </div>
        <div
          style={show ? { filter: "blur(3px)" } : {}}
          className="t-container2"
        >
          <div
            style={show ? { filter: "blur(3px)" } : {}}
            className="t-heading"
          >
            <span className="t-user-name"> Total Balance: </span>
            <span className="t-lastdate"> { }</span>
            <span className="t-balance"> ₹ {blance}</span>
          </div>

          {
            // to map transaction at Transaction Component
            transactions?.map((item, index) => {
              let newDate = new Date(item.date);
              newDate = newDate.toLocaleString("en-IN");
              currentBalance += item.amount;
              return (
                <TransactionComp

                  key={index}
                  show={show}
                  amount={item.amount}
                  currentBalance={currentBalance}
                  previusBalance={currentBalance - item.amount}
                  dis={item.dis}
                  type={item.type}
                  date={newDate}
                />
              );

            })
          }
        </div>
      </div>

      {show && (
        <NewTransaction
          show={show}
          refresh={getTransactions}
          Thandle={Thandle}
          uid={params.id}
          Setshow={Setshow}
        />
      )}
    </div>
  );
};

export default Transactions;
