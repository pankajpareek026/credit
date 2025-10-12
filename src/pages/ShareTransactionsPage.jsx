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
import { Api } from "@mui/icons-material";
document.title = "Credit | Shared Transaction History"
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
  const [allTransactions, setAllTransactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientNames, setClientNames] = useState([]);
  const [filteredTotals, setFilteredTotals] = useState(null);
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
          credentials: "include",
          mode: 'cors'
        });
        const data = await response.json();
        if (data.isSuccess) {
          const { clientName, parentName, totalSent, totalRecived, balance, transactions, isMerged: mergedFlag } = data?.responseData;
          const basicData = {
            clientName,
            parentName,
            totalRecivedAmount: totalRecived,
            totalSentAmount: totalSent,
            totalRemainingAmount: balance,
          };
          setAPIData(basicData);
          setAllTransactions(transactions);
          setTransactions(transactions);
          setIsMerged(mergedFlag || false);

          // Extract unique client names for merged shares
          if (mergedFlag && transactions) {
            const uniqueClientNames = [...new Set(transactions.map(t => t.clientName).filter(Boolean))];
            setClientNames(uniqueClientNames);
          }
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

  // Function to filter transactions by client
  const filterTransactionsByClient = (clientName) => {
    if (!isMerged || !allTransactions) return;

    if (selectedClient === clientName) {
      // If clicking the same client, show all transactions
      setSelectedClient(null);
      setTransactions(allTransactions);
      setFilteredTotals(null);
    } else {
      // Filter transactions for the selected client
      setSelectedClient(clientName);
      const filteredTransactions = allTransactions.filter(t => t.clientName === clientName);
      setTransactions(filteredTransactions);

      // Calculate totals for filtered transactions
      const totals = calculateTotals(filteredTransactions);
      setFilteredTotals(totals);
    }
  };

  // Function to show all transactions
  const showAllTransactions = () => {
    setSelectedClient(null);
    setTransactions(allTransactions);
    setFilteredTotals(null);
  };

  // Function to calculate totals for given transactions
  const calculateTotals = (transactionList) => {
    if (!transactionList || transactionList.length === 0) {
      return {
        totalReceived: 0,
        totalSent: 0,
        balance: 0
      };
    }

    const totals = transactionList.reduce((acc, transaction) => {
      if (transaction.type === "recived") {
        acc.totalReceived += Math.abs(transaction.amount);
      } else if (transaction.type === "sent") {
        acc.totalSent += Math.abs(transaction.amount);
      }
      return acc;
    }, { totalReceived: 0, totalSent: 0 });

    totals.balance = totals.totalSent - totals.totalReceived;
    return totals;
  };

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
        {/* <div style={{ fontSize: "small",textAlign:"center",color:"gray", backgroundColor :"black" }}>{`Transactions Between `} <span style={{ color: "orange" }}>{APIdata?.parentName}</span> and <span style={{ color: "red" }}>{APIdata?.clientName}</span>
        </div> */}
        <h1 className="share-page-first-heading">
          {isMerged ? "Merged Transaction History" : "Transaction History"}
        </h1>

        {APIdata && (
          <h2 className="share-name">
            {isMerged ? (
              <>
                <span style={{ color: "rgb(20, 241, 149)" }}>Mixed ({clientNames.length})</span>
                <SwapHorizIcon
                  title={`Merged transactions from ${clientNames.length} clients with ${APIdata?.parentName}`}
                  style={{ transform: "scale(.9)", marginTop: "auto" }}
                />
                {APIdata?.parentName}
              </>
            ) : (
              <>
                {APIdata.clientName}{" "}
                <SwapHorizIcon
                  title={`Transactions between ${APIdata?.clientName} and ${APIdata?.parentName}`}
                  style={{ transform: "scale(.9)", marginTop: "auto" }}
                />{" "}
                {APIdata?.parentName}
              </>
            )}
          </h2>
        )}


        {/* Client Tiles for Merged Shares */}
        {isMerged && clientNames.length > 0 && (
          <div style={{
            margin: "15px 0",
            padding: "0 10px"
          }}>
            <div
              className="client-tiles-container"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                maxHeight: "120px",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "10px",
                backgroundColor: "rgba(36, 38, 43, 0.8)",
                borderRadius: "8px",
                border: "1px solid rgba(20, 241, 149, 0.2)",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(20, 241, 149, 0.5) transparent"
              }}>
              {/* All Transactions Tile */}
              <div
                onClick={showAllTransactions}
                style={{
                  padding: "8px 12px",
                  backgroundColor: selectedClient === null ? "rgb(20, 241, 149)" : "rgba(20, 241, 149, 0.2)",
                  color: selectedClient === null ? "black" : "rgb(20, 241, 149)",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: selectedClient === null ? "2px solid rgb(20, 241, 149)" : "2px solid rgba(20, 241, 149, 0.3)",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  userSelect: "none"
                }}
                onMouseEnter={(e) => {
                  if (selectedClient !== null) {
                    e.target.style.backgroundColor = "rgba(20, 241, 149, 0.3)";
                    e.target.style.borderColor = "rgba(20, 241, 149, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClient !== null) {
                    e.target.style.backgroundColor = "rgba(20, 241, 149, 0.2)";
                    e.target.style.borderColor = "rgba(20, 241, 149, 0.3)";
                  }
                }}
              >
                All ({allTransactions?.length || 0})
              </div>

              {/* Individual Client Tiles */}
              {clientNames.map((clientName, index) => {
                const clientTransactionCount = allTransactions?.filter(t => t.clientName === clientName).length || 0;
                const isActive = selectedClient === clientName;

                return (
                  <div
                    key={index}
                    onClick={() => filterTransactionsByClient(clientName)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: isActive ? "rgb(20, 241, 149)" : "rgba(20, 241, 149, 0.2)",
                      color: isActive ? "black" : "rgb(20, 241, 149)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: isActive ? "2px solid rgb(20, 241, 149)" : "2px solid rgba(20, 241, 149, 0.3)",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = "rgba(20, 241, 149, 0.3)";
                        e.target.style.borderColor = "rgba(20, 241, 149, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = "rgba(20, 241, 149, 0.2)";
                        e.target.style.borderColor = "rgba(20, 241, 149, 0.3)";
                      }
                    }}
                    title={`View transactions for ${clientName} (${clientTransactionCount} transactions)`}
                  >
                    {clientName} ({clientTransactionCount})
                  </div>
                );
              })}
            </div>

            {/* Selected Client Info */}
            {selectedClient && (
              <div style={{
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "rgba(20, 241, 149, 0.1)",
                borderRadius: "6px",
                border: "1px solid rgba(20, 241, 149, 0.3)",
                textAlign: "center"
              }}>
                <p style={{
                  color: "rgb(20, 241, 149)",
                  fontSize: "13px",
                  margin: "0",
                  fontWeight: "500"
                }}>
                  Showing transactions for: <strong>{selectedClient}</strong>
                  {filteredTotals && (
                    <span style={{ display: "block", fontSize: "11px", marginTop: "4px", opacity: "0.8" }}>
                      Balance: ₹ {filteredTotals.balance.toFixed(2)} |
                      Sent: ₹ {filteredTotals.totalSent.toFixed(2)} |
                      Received: ₹ {filteredTotals.totalReceived.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
        {APIdata && (
          <div className="total-transctions-amount-container">
            <div className="upper">
              <div className="share-left">
                <ArrowDownwardIcon />
                ₹ {filteredTotals ? filteredTotals.totalSent.toFixed(2) : (APIdata.totalSentAmount ? APIdata.totalSentAmount : 0.00)}
                <span>
                  <InfoIcon
                    titleAccess={
                      selectedClient
                        ? `Amount sent by ${APIdata?.parentName} to ${selectedClient}`
                        : isMerged
                          ? `Total amount sent by ${APIdata?.parentName} to all selected clients`
                          : `Sent by ${APIdata?.parentName}`
                    }
                    style={infoIconStyle}
                  />
                </span>
              </div>
              <div className="share-right">
                <ArrowUpwardIcon />
                ₹ {filteredTotals ? filteredTotals.totalReceived.toFixed(2) : (APIdata?.totalRecivedAmount ? APIdata?.totalRecivedAmount : 0.00)}
                <span>
                  <InfoIcon
                    titleAccess={
                      selectedClient
                        ? `Amount received by ${APIdata?.parentName} from ${selectedClient}`
                        : isMerged
                          ? `Total amount received by ${APIdata?.parentName} from all selected clients`
                          : `Sent by ${APIdata?.clientName}`
                    }
                    style={infoIconStyle}
                  />
                </span>
              </div>
            </div>

            <div className="lower">
              <div className="remaining-balance">
                Remaining balance: ₹ {filteredTotals ? filteredTotals.balance.toFixed(2) : (APIdata?.totalRemainingAmount ? parseFloat(APIdata.totalRemainingAmount).toFixed(2) : 0.00)}
                <InfoIcon
                  titleAccess={
                    selectedClient
                      ? (filteredTotals?.balance > 0
                        ? `${selectedClient} owes ${APIdata?.parentName}`
                        : `${APIdata?.parentName} owes to ${selectedClient}`)
                      : isMerged
                        ? (APIdata?.totalRemainingAmount > 0
                          ? `Combined balance: All selected clients owe ${APIdata?.parentName}`
                          : `Combined balance: ${APIdata?.parentName} owes to all selected clients`)
                        : (APIdata?.totalRemainingAmount > 0
                          ? `${APIdata?.clientName} have to pay`
                          : `${APIdata?.clientName} have to collect`)
                  }
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
                type={transaction?.type}
                amount={transaction?.amount}
                date={new Date(transaction?.date).toLocaleString('en-IN')}
                message={transaction?.dis}
                clientName={transaction?.clientName}
              />
            ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ShareTransactions;
