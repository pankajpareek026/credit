import React, { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import InfoIcon from "@mui/icons-material/Info";
import { useParams, Link } from "react-router-dom";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Logo from "../components/Logo";
import ShareTransactionCard from "../components/ShareTransactinCard";
import api from "../api_source";
import Loading from "../components/Loading";
import WarningToast from "../components/WarningToast";

const ShareTransactions = () => {
  // Define info icon style
  const infoIconStyle = {
    cursor: "pointer",
    fontSize: "medium",
    color: "white",
    marginRight: "7px",
    transform: "scale(0.7)",
    "&:hover": {
      cursor: "pointer",
      color: "rgb(20, 241, 149)",
    },
  };

  const [APIdata, setAPIData] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { source } = useParams();

  useEffect(() => {
    const fetchShareData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/share`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            shareToken: source.toString(),
          },
          credentials: "include"
        });
        const data = await response.json();
        if (data.isSuccess) {
          const { clientName, parentName, totalSent, totalRecived, balance, transactions } = data?.responseData;
          const basicData = {
            clientName,
            parentName,
            totalRecivedAmount: totalRecived,
            totalSentAmount: totalSent,
            totalRemainingAmount: balance,
          };
          setAPIData(basicData);
          setTransactions(transactions);
          return
        }
        WarningToast(data.message);
      } catch (error) {
        WarningToast(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShareData();
  }, [source]);

  return (
    <>
      <div className="share-container">

        <Loading isSimpleLoading={true} isLoading={loading} />

        <div className="logo-and-join-container-at-shate-page">
          <Logo />

          <Link to={"/register"} className="join-btn">
            Join
          </Link>

        </div>
        <hr />
        <h1 className="first-heading">Transaction History</h1>

        {APIdata && (
          <h2 className="share-name">
            {APIdata.clientName}{" "}
            <SwapHorizIcon
              title={`Transactions between ${APIdata.clientName} and ${APIdata.parentName}`}
              style={{ transform: "scale(.9)", marginTop: "auto" }}
            />{" "}
            {APIdata.parentName}
          </h2>
        )}
        {APIdata && (
          <div className="total-transctions-amount-container">


            <div className="upper">
              <div className="share-left">
                <ArrowDownwardIcon />
                ₹ {APIdata.totalRecivedAmount}
                <span>
                  <InfoIcon titleAccess="You have Received" style={infoIconStyle} />
                </span>
              </div>
              <div className="share-right">
                <ArrowUpwardIcon />
                ₹ {APIdata.totalSentAmount}
                <span>
                  <InfoIcon titleAccess="You have Sent" style={infoIconStyle} />
                </span>
              </div>
            </div>


            <div className="lower">
              <div className="remaining-balance">
                Remaining balance: ₹ {APIdata.totalRemainingAmount}
                <InfoIcon
                  titleAccess={APIdata.totalRemainingAmount > 0 ? "you have to pay" : "you have to collect"}
                  style={infoIconStyle}
                />
              </div>
            </div>


          </div>
        )}
        {APIdata && <h2 className="share-heading">Transactions</h2>}


        <div style={{ height: APIdata && "auto" }} className="transaction-card-container">
          {transactions &&
            transactions.map((transaction, index) => (
              <ShareTransactionCard
                key={index}
                type={transaction.type}
                amount={transaction.amount}
                date={new Date(transaction.date).toLocaleString('en-IN')}
                message={transaction.dis}
              />
            ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ShareTransactions;
