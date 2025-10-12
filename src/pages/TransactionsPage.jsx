import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

//mui icons  --start
import ShareIcon from "@mui/icons-material/Share";
import MergeIcon from '@mui/icons-material/Merge';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
//mui icons --end
import TransactionComp from "../components/TransactionComp";
import NewTransaction from "../components/NewTransaction";
import SuccessToast from "../components/SuccessToast";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { setClientId } from "../features/reducers/clientDataSlice";
import CustomModal from "../mui_comps/CustomModal";
import MuiInputBox from "../mui_comps/MuiInputBox";
import AdvanceNav from "../components/AdvanceNav";
import { ToastContainer } from "react-toastify";
import api from "../api_source";
import LinkCard from "../components/LinkCard";
import ErrorToast from "../components/ErrorToast";


const Transactions = () => {
  let params = useParams();
  const [show, Setshow] = useState(false);
  const [transactions, SetTransactions] = useState([]); //array for transactions
  const [blance, Setbalance] = useState(0);
  const [name, Setname] = useState("");
  const [shareData, setShareData] = useState();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [link, setLink] = useState("");
  const [validTill, setValidTill] = useState({ value: 1, unit: "days" })
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [isScrollDownButton, setIsScrollDownButton] = useState(true)
  const [isScrollHigh, setIsScrollHigh] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showShareTransactionModal, setShowShareTransactionModal] = useState(false);
  const [allClients, setAllClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  let currentBalance = 0
  const linkRef = useRef()
  const transactionsContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (transactionsContainerRef.current) {
      const scrollHeight = transactionsContainerRef.current.scrollHeight;
      const scrollTop = transactionsContainerRef.current.scrollTop;
      const clientHeight = transactionsContainerRef.current.clientHeight;
      const isScrolledToBottom = scrollHeight - scrollTop === clientHeight;
      

      if (!isScrolledToBottom) {
        transactionsContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
      // if (isScrolledToBottom) {
      //   setIsScrollDownButton(false);
      // }
    }
  };


  const handleScroll = () => {
    if (transactionsContainerRef.current) {
      const scrollTop = transactionsContainerRef.current.scrollTop; //how far from top
      const scrollHeight = transactionsContainerRef.current.scrollHeight;//height of scroll container
      const clientHeight = transactionsContainerRef.current.clientHeight; //height of clinet mean content visible on display
      const atBottom = scrollHeight - scrollTop === clientHeight; //if at bottom of container
      const scrollDistance = scrollHeight - scrollTop;
      console.log("sdt: scroll distance:=>", scrollDistance)
      if (scrollDistance > 700) {
        setIsScrollHigh(true)

      }
      if (scrollDistance < 595) {
        setIsScrollHigh(true)
      }

      setIsScrollDownButton(!atBottom);


      //if at bottom of container than hide scroll down button
    }
  };
  // to copy the generated link
  const copyLinkHandle = () => {
    window.navigator.clipboard.writeText(link)
    linkRef.current.select()
    SuccessToast("copied successfully", "bottom-center")
    return
  }

  const Thandle = () => {
    Setshow((position) => !position);
  };

  const dispatch = useDispatch()
  const auth = localStorage.getItem("user");

  const getAllClients = useCallback(() => {
    if (auth) {
      fetch(`${api}/clients`, {
        headers: {
          "content-type": "application/json",
          token: auth,
        },
        credentials: "include",
        mode: 'cors'
      })
        .then(response => {
          if (!response.ok) {
            return ErrorToast('Network response was not ok');
          }
          return response.json();
        })
        .then(result => {
          if (result.isSuccess) {
            setAllClients(result.responseData);
            setFilteredClients(result.responseData);
          } else {
            ErrorToast(result.message);
          }
        })
        .catch(error => {
          ErrorToast(error.message);
        });
    }
  }, [auth]);

  const getTransactions = useCallback(() => {
    setIsLoading(true)
    // Fetch transactions data from the server
    try {
      fetch(`${api}/client/transactions`, {

        headers: {
          clientid: params.id,
          token: auth,
        },
        credentials: "include",
        mode: 'cors'
      })
        .then(response => {
          // Check if response is successful
          if (!response.ok) {
            return ErrorToast('Network response was not ok');
          }
          // Parse response JSON
          return response.json();
        })
        .then(result => {
          // console.log("result=>", result);
          // Extract necessary data from the result
          if (result.isError) return ErrorToast(result.message);
          const { name, trns, balance } = result.isSuccess ? result.responseData : { name: "", transactions: [], balance: 0 };

          // Set the name of the user at the top and in the header section in the transactions component
          Setname(name);

          // Set all transaction related to the client
          SetTransactions(trns);

          // Set the balance
          Setbalance(balance);
        })
        .catch(error => {
          // Handle errors
          ErrorToast(error.message);
        }).finally(() => {
          setIsLoading(false)
        });
    } catch (error) {

    }
  }, [params.id, auth]);

  useEffect(() => {
    dispatch(setClientId({ clientId: params.id }))
    getTransactions();
    getAllClients();
  }, [dispatch, params.id, getTransactions, getAllClients]);

  useEffect(() => {
    if (clientSearchQuery.trim() === "") {
      setFilteredClients(allClients);
    } else {
      const filtered = allClients.filter(client =>
        client.name.toLowerCase().includes(clientSearchQuery.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [clientSearchQuery, allClients]);

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  }
  document.title = `Credit | Transaction / ${name}`;

  // to save time in state like 5,10 
  const timeValueHandle = (e) => {
    if (e.target.value >= 10) {
      setValidTill(current => ({
        ...current, value: 10
      }))
    }
    else if (e.target.value < 0) {
      setValidTill(current => ({
        ...current, value: 1
      }))
    }
    else {
      setValidTill(current => ({
        ...current, value: e.target.value
      }))
    }
  }

  // to save time unit is state like hours,days
  const timeUnitHandle = (e) => {
    setValidTill(current => ({
      ...current,
      unit: e.target.value
    }));
  };

  // generate sharable link for transaction details
  const getTransactionsLink = async () => {

    console.log("transaction is running :>");
    try {
      // console.log(validTill)
      // return 0
      setIsLoading(true);
      setIsGeneratingLink(true)
      fetch(`${api}/shareRequest/${validTill.value}/${validTill.unit}`, {
        method: "post",
        headers: {
          "content-type": "application/json",
          token: auth.toString(),
        },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify({
          clientId: params.id.toString(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {

          if (data.isSuccess) {
            const { link } = data.responseData
            setShareData(data);
            setIsShareModalOpen(true);
            setLink(link)
            return
          }

          ErrorToast(data.message)
        }).catch((err) => {
          ErrorToast(err.message);

        }).finally(() => {
          setIsLoading(false)
          setIsGeneratingLink(false)

        });
    } catch (error) {
      // console.log("share :", error);
      ErrorToast(error.message)
    }
  };

  const handleClientSelect = (client) => {
    const isSelected = selectedClients.some(selected => selected._id === client._id);
    if (isSelected) {
      setSelectedClients(selectedClients.filter(selected => selected._id !== client._id));
    } else {
      setSelectedClients([...selectedClients, client]);
    }
  };

  const removeSelectedClient = (clientId) => {
    setSelectedClients(selectedClients.filter(client => client._id !== clientId));
  };

  const handleClientSearch = (e) => {
    setClientSearchQuery(e.target.value);
  };

  const handleMergeProceed = () => {
    if (selectedClients.length === 0) {
      ErrorToast("Please select at least one client");
      return;
    }
    setShowMergeModal(false);
    setShowShareTransactionModal(true);
  };

  const getValidityInMs = () => {
    const { value, unit } = validTill;
    const multipliers = {
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
      months: 30 * 24 * 60 * 60 * 1000,
      years: 365 * 24 * 60 * 60 * 1000
    };
    return value * multipliers[unit];
  };

  const handleCreateShareLink = async () => {
    if (selectedClients.length === 0) {
      ErrorToast("Please select at least one client");
      return;
    }

    try {
      setIsGeneratingLink(true);

      const clientIds = selectedClients.map(client => client._id);

      const response = await fetch(`${api}/shareRequest/${validTill.value}/${validTill.unit}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: auth.toString(),
        },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify({
          clientIds: clientIds,
          currentClientId: params.id
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        const { link } = data.responseData;
        setLink(link);
        setShowShareTransactionModal(false);
        setIsShareModalOpen(true);
        SuccessToast("Share link created successfully!");
      } else {
        ErrorToast(data.message);
      }
    } catch (error) {
      ErrorToast("Failed to create share link");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // serch transaction
  const searchHandle = (e) => {
    try {
      let query = e.target.value;
      if (query === "") {
        setNotFound(false);
        return getTransactions()
      }
      // console.log("q=>>", query)
      setIsLoading(true)
      fetch(`${api}/client/search`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: auth,
          clientId: params.id,
          query: query,
        },
        credentials: "include"
      })
        .then(res => res.json())
        .then((result) => {
          // console.log("res=>", result);
          if (result.isSuccess && result.message !== "transaction not found") {
            setNotFound(false)
            const { responseData } = result
            // console.log("transaction", responseData);
            SetTransactions(responseData)
            return
          }
          if (result.message === "transaction not found") {
            setNotFound(true);
            return
          }
        }).catch((err) => {
          ErrorToast(err.message)
        })
        .finally(() => {
          setIsLoading(false)
        })

    } catch (error) {
      ErrorToast(error.message);
    }

  };


  return (
    <div className="transactions">

      <Loading
        isLoading={isLoading}
        isSimpleLoading={true}
      />

      <AdvanceNav isDashboard={true} />

      <div className="t-right">
        {/* container which contains add transaction button */}

        <div className="add-transaction-icon"
          title="Add new transactions"
          style={{ fontSize: "x-large", marginLeft: "auto" }}
          onClick={Thandle}>
          {/* Add transaction Icon */}
          <AddIcon />
        </div>

        {/* modal which is used to generate share transaction link */}
        <CustomModal
          isTitle={true}
          openModal={isShareModalOpen}
          modalType={"input"}
          title={"Share transactions"}
          maxW="350px"
          isHelperText={true}
          // helperText={"Shere this Link with your client"}
          firstButtonName={link ? "close" : "cancel"}
          isFirstButton={true}
          firstButtonType={"close"}
          isSecondButton={true}
          secondButtonName={!link ? "create link" : "copy link"}
          secodButtonType={"action"}
          closeModal={closeShareModal}
          firstOnClick={() => setIsShareModalOpen(false)}
          secodOnClick={!link ? getTransactionsLink : copyLinkHandle}
          isSecondLoading={isGeneratingLink}
          content={
            <div className="link-validity-container">
              {!link && <>
                <legend>Choose link validity time </legend>
                <div className="input-and-selection-container">
                  <input className="time-inp" value={validTill.value} onKeyDown={(e) => { e.key === "Enter" && getTransactionsLink() }} onChange={timeValueHandle} type="number" min={1} max={10} placeholder="Enter Time" />
                  <select value={validTill.unit} onChange={timeUnitHandle} >
                    <option value="hours">Hour</option>
                    <option value="days">Day</option>
                    <option value="weeks">Week</option>
                    <option value="months">Month</option>
                    <option value="years">Year</option>

                  </select>

                </div>
              </>}

              <p>{shareData?.message}</p>
              {
                link && <>
                  <MuiInputBox
                    ref={linkRef}
                    // onChangeFn={printLinkRef}
                    height={"25px"}
                    bgColor="black"
                    label="link"
                    inpvalue={link}
                    inputValue={link}
                    // isDisabled={true}
                    isReadOnly={true}

                  />
                </>
              }            </div>
          }
        />


        {/* Modal for the share options like share / merge and share */}

        <CustomModal
          openModal={showShareOptions}
          isTitle={true}
          title={"Share"}
          isFirstButton={false}
          isSecondButton={false}
          maxW="550px"
          isTnxDetailDialog={true}
          closeModal={() => setShowShareOptions(false)}
          content={
            <div className="flex justify-center items-center gap-8 py-8 font-primary">
              <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => {
                setShowShareOptions(false);
                setIsShareModalOpen(true);
              }}>
                <div className="font-bold text-lg text-white">Share</div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 bg-card border-2 border-main shadow-theme-2 ">
                  <ShareIcon sx={{ color: "white", fontSize: "30px" }} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => {
                setShowShareOptions(false);
                setShowMergeModal(true);
              }}>
                <div className="font-bold text-lg text-white">Merge & Share</div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 bg-card border-2 border-main shadow-theme-2 ">
                  <MergeIcon sx={{ color: "white", fontSize: "30px",hover: { color: "white" } }} />
                </div>
              </div>
            </div>
          }
        />

        {/* Merge & Share Modal */}
        <CustomModal
          openModal={showMergeModal}
          isTitle={true}
          title={"Merge & Share"}
          isFirstButton={true}
          firstButtonType={"close"}
          firstButtonName={"cancel"}
          isSecondButton={true}
          secondButtonName={"Proceed"}
          secodButtonType={"action"}
          maxW="600px"
          closeModal={() => {
            setShowMergeModal(false);
            setSelectedClients([]);
            setClientSearchQuery("");
          }}
          firstOnClick={() => {
            setShowMergeModal(false);
            setSelectedClients([]);
            setClientSearchQuery("");
          }}
          secodOnClick={handleMergeProceed}
          content={
            <div className="flex flex-col gap-4 font-primary">
              {/* Selected Clients Section */}
              {false && <div>
                <div className="text-white font-bold text-lg mb-3">selected clients</div>
                <div className="flex flex-wrap gap-2 mb-4  p-3 rounded-lg">
                  {selectedClients.map((client) => (
                    <div
                      key={client._id}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-main shadow-theme-2"
                    >
                      <span className="text-sm text-white">{client.name}</span>
                      <CloseIcon
                        sx={{
                          color: "var(--main)",
                          fontSize: "16px",
                          cursor: "pointer",
                          '&:hover': { color: 'white' }
                        }}
                        onClick={() => removeSelectedClient(client._id)}
                      />
                    </div>
                  ))}
                </div>
              </div>}

              {/* Separator */}
              <hr className="border-card border" />

              {/* Clients List Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-lg text-white">clients</div>
                  <SearchIcon sx={{ color: "white", fontSize: "20px" }} />
                </div>

                {/* Search Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearchQuery}
                    onChange={handleClientSearch}
                    className="w-full px-3 py-2 rounded bg-second-dark border border-card text-white outline-none focus:border-main font-primary transition-colors"
                  />
                </div>

                {/* Clients List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredClients.map((client) => {
                    const isSelected = selectedClients.some(selected => selected._id === client._id);
                    return (
                      <div
                        key={client._id}
                        className="flex items-center justify-between p-3 rounded cursor-pointer bg-mobile-client-card-bg border border-card shadow-none hover:bg-card hover:border-main transition-all duration-200"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <CheckBoxIcon sx={{ color: "var(--main)", fontSize: "24px" }} />
                          ) : (
                            <CheckBoxOutlineBlankIcon sx={{ color: "white", fontSize: "24px" }} />
                          )}
                          <span className="font-medium text-white">{client.name}</span>
                        </div>
                        <span className="text-white font-mono">₹ {parseFloat(client.balance).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          }
        />

        {/* Share Transaction Modal */}
        <CustomModal
          openModal={showShareTransactionModal}
          isTitle={true}
          title={"Share Transaction"}
          isFirstButton={true}
          firstButtonType={"close"}
          firstButtonName={"cancel"}
          isSecondButton={true}
          secondButtonName={"Create Link"}
          secodButtonType={"action"}
          maxW="600px"
          closeModal={() => {
            setShowShareTransactionModal(false);
            setSelectedClients([]);
            setClientSearchQuery("");
          }}
          firstOnClick={() => {
            setShowShareTransactionModal(false);
            setSelectedClients([]);
            setClientSearchQuery("");
          }}
          secodOnClick={handleCreateShareLink}
          isSecondLoading={isGeneratingLink}
          content={
            <div className="flex flex-col gap-4 font-primary">
              {/* Selected Clients Section */}
              <div>
                <div className="text-white font-bold text-lg mb-3">selected clients</div>
                <div className="flex flex-wrap gap-2 mb-4 bg-mobile-client-card-bg p-3 rounded-lg">
                  {selectedClients.map((client) => (
                    <div
                      key={client._id}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-main shadow-theme-2"
                    >
                      <span className="text-sm text-white">{client.name}</span>
                      <CloseIcon
                        sx={{
                          color: "var(--main)",
                          fontSize: "16px",
                          cursor: "pointer",
                          '&:hover': { color: 'white' }
                        }}
                        onClick={() => removeSelectedClient(client._id)}
                      />
                    </div>
                  ))}
                  <div
                    className="w-8 h-8 rounded-full bg-main flex items-center justify-center cursor-pointer hover:bg-advance transition-colors"
                    onClick={() => {
                      setShowShareTransactionModal(false);
                      setShowMergeModal(true);
                    }}
                  >
                    <AddIcon sx={{ color: "white", fontSize: "20px" }} />
                  </div>
                </div>
              </div>

              {/* Link Validity Section */}
              <div>
                <div className="text-white font-bold text-lg mb-3">Choose link validity</div>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={validTill.value}
                    onChange={timeValueHandle}
                    className="w-20 px-3 py-2 rounded bg-second-dark border border-card text-white outline-none focus:border-main font-primary"
                  />
                  <select
                    value={validTill.unit}
                    onChange={timeUnitHandle}
                    className="px-3 py-2 rounded bg-second-dark border border-card text-white outline-none focus:border-main font-primary"
                  >
                    <option value="hours">Hour</option>
                    <option value="days">Day</option>
                    <option value="weeks">Week</option>
                    <option value="months">Month</option>
                    <option value="years">Year</option>
                  </select>
                </div>
                <div className="text-main text-sm">
                  Valid till: {new Date(Date.now() + getValidityInMs()).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
            </div>
          }
        />

        {/* container which contains user name and share button */}
        <div className="t-upper-container">
          <p
            style={show ? { filter: "blur(.7px)" } : {}}
            className="t-username"
            title={`Client Name : ${name}`}
          >
            {name}
          </p>
          <div className="search-container">
            <SearchIcon className="search-p" />
            <input
              style={show ? { filter: "blur(3px)" } : {}}
              type="search"
              placeholder="Search Transaction "
              onChange={searchHandle}
            />
          </div>
          <button onClick={() => setShowShareOptions(true)} className="share">
            <ShareIcon sx={{ color: "rgb(20, 241, 149)", fontsize: "30px" }} />
          </button>
        </div>

        {/* container which contains all transactions */}
        <div onScroll={handleScroll}
          ref={transactionsContainerRef}
          style={show ? { filter: "blur(3px)", backgroundColor: "red ! important" } : {}}
          className="t-container2"
        >
          {/* sticky : this contains balance */}
          <div
            style={show ? { filter: "blur(3px)" } : {}}
            className="t-heading"
          >
            <span className="t-user-name">Balance  :</span>
            <span className="t-balance"> ₹ {parseFloat(blance).toFixed(2)}</span>

          </div>
          {
            (isScrollDownButton && transactions?.length > 15 && isScrollHigh) && <div onClick={scrollToBottom} className="scroll-down">
              <KeyboardArrowDownSharpIcon />
            </div>
          }
          {/* if transaction not found during search operation */}
          {notFound ? <LinkCard
            content={"Transaction Not Found"}
            contentColor={"red"}
          />
            // to map transaction at Transaction Component
            : (transactions?.map((item, index) => {
              let newDate = new Date(item.date);
              newDate = newDate.toLocaleString("en-IN");
              currentBalance += item.amount;

              return (

                <TransactionComp
                  key={index}
                  tId={item.tId}
                  show={show}
                  amount={item.amount}
                  currentBalance={currentBalance}
                  previusBalance={currentBalance - item.amount}
                  dis={item.dis}
                  type={item.type}
                  refresh={getTransactions}
                  date={item.date}
                  newDate={newDate}
                />

              );

            }))
          }
        </div>
      </div>


      <NewTransaction
        isOpen={show}
        SetIsOpen={Setshow}
        heading={"Add Transaction"}
        show={show}
        refresh={getTransactions}
        Thandle={Thandle}
        Setshow={Setshow}
      />
      <ToastContainer />
    </div>
  );
};

export default Transactions;



























// import React, { useRef, useState } from 'react';

// const ScrollToBottomButton = () => {
//     const [showButton, setShowButton] = useState(true);
//     const scrollContainerRef = useRef(null);

// const scrollToBottom = () => {
//   if (scrollContainerRef.current) {
//     const scrollHeight = scrollContainerRef.current.scrollHeight;
//     scrollContainerRef.current.scrollTop = scrollHeight;
//   }
// };

// const handleScroll = () => {
//   if (scrollContainerRef.current) {
//     const scrollTop = scrollContainerRef.current.scrollTop;
//     const scrollHeight = scrollContainerRef.current.scrollHeight;
//     const clientHeight = scrollContainerRef.current.clientHeight;
//     const atBottom = scrollHeight - scrollTop === clientHeight;

//     setShowButton(!atBottom);
//   }
// };

//     return (
//         <div
//             ref={scrollContainerRef}
//             style={{ height: '200px', overflowY: 'scroll', border: '1px solid black' }}
//             onScroll={handleScroll}
//         >
//             {/* Your content here */}
//             <div style={{ height: '1000px' }}>Scrollable content...</div>

//             {/* Scroll to bottom button */}
//             {showButton && (
//                 <button onClick={scrollToBottom} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
//                     Scroll to Bottom
//                 </button>
//             )}
//         </div>
//     );
// };

// export default ScrollToBottomButton;
