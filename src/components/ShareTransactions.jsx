import React, { useEffect, useState, useId } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Logo from "./Logo";
import ShareTransactionCard from "./ShareTransactinCard";
import { Link } from "react-router-dom";
import api from "../api_source";

const ShareTransactions = () => {
  const infoIconStyle = {
    cursor: "pointer",
    fontSize: "medium",
    color: "gray",
    marginRight: "7px",
    "&:hover": {
      cursor: "pointer",
      color: "rgb(20, 241, 149)",
    },
  };
  const ID = useId();
  const [APIdata, setAPIData] = useState();
  const [transactions, setTransactions] = useState();
  const { source } = useParams();
  console.log(source);
  useEffect(() => {
    fetch(`${api}/share`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        shareToken: source.toString(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("parentName :", data.parentName);

        const besicData = {
          clientName: data.clientName,
          parentName: data.parentName,
          totalRecivedAmount: data.totalRecivedAmount,
          totalSentAmount: data.totalSentAmount,
          totalRemainingAmount: data.totalRemainingAmount,
        };
        setAPIData(besicData);
        setTransactions(data.transactions);
      });
  }, []);
  return (
    <>
      <div className="share-container">
        <div className="logo-and-join-container-at-shate-page">
          <Logo />{" "}
          <Link to={"/register"} className="join-btn">
            Join{" "}
          </Link>
        </div>
        <hr />
        <h1 className="first-heading">Transaction History </h1>
        <h2 className="share-name ">
          {APIdata?.clientName} & {APIdata?.parentName}
        </h2>

        <div className="total-transctions-amount-container">
          <div className="upper">
            {" "}
            <div className="share-left">
              <ArrowDownwardIcon />₹ {APIdata?.totalRecivedAmount}
              <span>
                <InfoIcon
                  titleAccess="You have Recived"
                  style={infoIconStyle}
                />
              </span>
            </div>
            <div className="share-right">
              <ArrowUpwardIcon />₹ {APIdata?.totalSentAmount}
              <span>
                <InfoIcon titleAccess="You have Send" style={infoIconStyle} />
              </span>{" "}
            </div>
          </div>

          <div className="lower">
            <div className="remaining-balance">
              {" "}
              Remaining balance : ₹ {APIdata?.totalRemainingAmount}
            </div>
          </div>
        </div>

        <h2 className="share-heading">Transactions</h2>

        <div className="transaction-card-container">
          {transactions
            ? transactions?.map((transaction) => {
                return (
                  <ShareTransactionCard
                    key={ID}
                    type={transaction.type}
                    amount={transaction.amount}
                    date={new Date(transaction.date).toLocaleString('en-IN')}
                    message={transaction.dis}
                  />
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default ShareTransactions;
