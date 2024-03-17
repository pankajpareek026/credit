import { Box, Divider, Stack, Typography } from '@mui/material';
import Slide from '@mui/material/Slide';
import React, { useState } from 'react';
import CustomModal from '../mui_comps/CustomModal';
import NewTransaction from './NewTransaction';
import { ToastContainer } from 'react-toastify';
import api from '../api_source';
import ErrorToast from './ErrorToast';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const textStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  height: "auto",
  WebkitLineClamp: '1',
  fontFamily: "Poppins",
  width: "50%"
}

const TransactionComp = ({ type, amount, date, dis, previusBalance, currentBalance, newDate, refresh, tId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [transactionData, setTransactionData] = useState({});
  const formatedDate = new Date(date).toLocaleString('en-IN');
  const auth = window.localStorage.getItem('user');

  const showDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // get transaction detail
  const getTransactionDetails = async (tId) => {
    try {
      let result = await fetch(`${api}/client/getTransactionDetail/${tId}`, {
        method: 'GET',
        headers: {
          "content-type": "application/json",
          token: auth
        },
        credentials: "include"
      });
      result = await result.json();
      setTransactionData(result.responseData);
      return result.isSuccess;
    } catch (error) {
      ErrorToast(error.message);
    }
  };

  // open edit transaction modal
  const openEditModal = async (tId) => {
    const requestStatus = await getTransactionDetails(tId);
    if (requestStatus) {
      setIsEditModal(true); //to open edit transaction modal
      setIsModalOpen(false); //to close transaction details modal
    } else {
      ErrorToast("Try again !");
    }
  };

  function closeTransDetailModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <CustomModal
        openModal={isModalOpen}
        isTitle={true}
        isTnxDetailDialog={true}
        closeModal={closeTransDetailModal}
        title={"Transaction Details"}
        setOpenModal={setIsModalOpen}
        isFirstButton={true}
        firstButtonName={"OK"}
        isSecondButton={true}
        secondButtonName={"Edit"}
        modalType={"input"}
        firstButtonType={"close"}
        secodButtonType={"action"}
        secodOnClick={() => openEditModal(tId)}
        firstOnClick={handleCloseModal}
        content={
          <>
            <Stack sx={{ width: "100%", marginLeft: "auto", marginRight: "auto", padding: "0px" }}>

              <Box sx={{ display: "flex", padding: "3px", justifyContent: "space-between" }}>
                <strong color='white'>Last balance :</strong> <Typography noWrap color={"white"}> ₹ {previusBalance}</Typography>
              </Box>
              <Divider />
              <hr />


              <Box sx={{ display: "flex", padding: "3px", width: "100%", justifyContent: "space-between" }}>
                <strong color='white'>Amount :</strong> <Typography noWrap color={"white"}> ₹ {amount}</Typography>
              </Box>
              <hr />


              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <strong color='white'>Current balance :</strong> <Typography noWrap color={"white"}> ₹ {currentBalance}</Typography>
              </Box>
              <hr style={{ width: "100%" }} />


              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <strong color='white'>Date : </strong> <Typography color={"white"}> {formatedDate}</Typography>
              </Box>
              <hr />


              <Box sx={{ width: "100%", display: "flex", overflow: "hidden", justifyContent: "space-between" }}>
                <strong color='white'>Description : </strong> <Typography sx={{ cursor: "pointer" }} title={dis} noWrap style={textStyle}> {dis}</Typography>
              </Box>
              <hr />


              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: 'white' }}>Transaction Type:</strong>{' '}
                <Typography>
                  {type === "IN" ? "Received" : "Sent"}
                </Typography>
              </Box>


              <hr />
            </Stack>
          </>
        }
      />

      <div onClick={showDetails} className={`Transaction-comp ${type}`}>
        <div className="tc-amt">₹{amount}</div>
        <p className="tc-date">{newDate}</p>
      </div>


      {isEditModal && (
        <NewTransaction
          isOpen={isEditModal}
          close={() => setIsEditModal(false)}
          heading={"Edit Transaction"}
          modalType={"edit"}
          show={isEditModal}
          refresh={refresh}
          Thandle={() => { setIsEditModal(current => !current) }}
          tData={transactionData}
          transactionType={transactionData.type}
          SetIsOpen={setIsEditModal}
          transactionId={tId}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default TransactionComp;
