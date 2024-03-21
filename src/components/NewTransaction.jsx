import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import api from '../api_source';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import ErrorToast from './ErrorToast';
import SuccessToast from './SuccessToast';
import WarningToast from './WarningToast';



const NewTransaction = ({ isOpen, close, transactionId, refresh, SetIsOpen, heading, modalType = "new", tData, transactionType = "IN" }) => {
  const token = window.localStorage.getItem("user")
  const [click, setClick] = useState({ in: transactionType == "IN" ? true : false, out: transactionType === "OUT" ? true : false });
  const [amount, setAmount] = useState(tData?.amount);
  const [date, setDate] = useState();
  const [disc, setDisc] = useState(tData?.dis);
  const [isLoading, setIsLoading] = useState(false);
  const clientId = useSelector(state => state.clientData.clientId);

  // function which handle add  / edit transactions
  const handleTransaction = (type) => {
    const amountValue = type === 'OUT' ? amount * (-1) : amount;
    const typeValue = type === 'OUT' ? 'OUT' : 'IN';


    if (modalType === "edit") {
      editApi(amountValue, date, disc, typeValue, transactionId) // here typeValue is SIDE OF TRANSACTION WHICH CAN BE "IN" OR "OUT"
      return
    }
    AddApi(amountValue, date, disc, typeValue)
    return
  }


  // functio to add new transactions in database
  const AddApi = async (amount, date, dis, type) => {
    try {
      setIsLoading(true)
      fetch(`${api}/client/newTransaction`, {
        method: "post",
        body: JSON.stringify({ amount, date, dis, type }),
        headers: { 'content-type': 'application/json', clientid: clientId, token: localStorage.getItem('user') },
        credentials: "include",
        mode: 'cors'
      }).then(response => response.json())
        .then((result) => {
          if (result.isSuccess) {
            SuccessToast(result.message);
            SetIsOpen(false)
            refresh();
            setAmount("")
            setDate("")
            setDisc("")
            setClick({ in: true, out: false })
            return
          }
          WarningToast(result.message);
        }).catch((err) => {
          ErrorToast(err.message);
        }).finally(() => {
          setIsLoading(false)
        });



    } catch (error) {

      WarningToast("An error occurred. Please try again.");
    }
  }

  // function  to edit existing translation in database
  const editApi = (amount, date, dis, type, tId) => {
    try {
      setIsLoading(true)
      fetch(`${api}/client/editTransaction/`, {
        method: 'PUT',
        headers: {
          "content-type": "application/json",
          token: token,
          clientid: clientId
        },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify({
          tId,
          amount,
          date,
          dis,
          type

        })
      })
        .then((response) => response.json())
        .then(data => {

          if (data.isSuccess) {
            SetIsOpen(false)
            refresh()
            return SuccessToast(data.message)
          }
          return ErrorToast(data.message)

        })
        .catch((err) => ErrorToast(err.message))
        .finally(() => {
          setIsLoading(false)

        });
    } catch (error) {
      ErrorToast(error.message)
    }
  }

  useEffect(() => {
    // Assuming you get the date string from your database
    if (tData?.date) {
      const dateString = tData?.date;

      // Convert the date string to a Date object
      const transactionDate = new Date(dateString);

      // Format the date as required by the input field (YYYY-MM-DDTHH:MM)

      const formattedDate = transactionDate.toISOString().slice(0, 16);

      // Set the formatted date as the default value for the input field

      setDate(formattedDate);
    }
  }, []);
  const toggleTransactionType = (type) => {
    setClick({ in: type === 'IN', out: type === 'OUT' });

    // setType(type);
  }


  // sumbit data if enter pressed in last input box
  const handleSubmit = async (type, key) => {
    if (key === "Enter") {
      // call api if enter  pressed 
      handleTransaction(type)
    }
  }

  return (
    <>
      {
        isOpen && <div className="add-t-container" style={{ height: "auto" }}>

          <Loading
            isLoading={isLoading}
            isSimpleLoading={true}
          />

          <div className='add-t'>
            <span className='close' onClick={() => SetIsOpen(false)}>[x]</span>
            <h1>{heading}</h1>

            <div className="buttons">
              <button className='in' style={{ backgroundColor: click.in ? "green" : "#100e0f" }} onClick={() => toggleTransactionType('IN')}>IN</button>
              <button className='out' style={{ backgroundColor: click.out ? "red" : "#100e0e" }} onClick={() => toggleTransactionType('OUT')}>OUT</button>
            </div>


            <div className="inner">
              {click.in && <div className="in">

                <div className='form'>
                  <h1>IN</h1>
                  <input type="number"
                    autoFocus value={amount}
                    min={0}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder='Amount'
                    required />

                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder='Date'
                    required />

                  <input
                    type="text"
                    value={disc}
                    onChange={(e) => setDisc(e.target.value)}
                    onKeyDown={(e) => { e.key == "Enter" && handleSubmit("IN", e.key) }}
                    placeholder='Comment'
                    required />

                  <button
                    style={{ cursor: isLoading ? "not-allowed" : "pointer", backgroundColor: isLoading ? "gray" : "green" }}
                    disabled={isLoading}
                    onClick={() => handleTransaction('IN')}
                  >{isLoading ? "processing . . . ." : "IN"}</button>
                </div>


              </div>}
              {click.out && <div className="out">


                <div className='form'>
                  <h1>OUT</h1>
                  <input type="number" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Amount' required />
                  <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} placeholder='Date' required />
                  <input type="text" value={disc} onChange={(e) => setDisc(e.target.value)} onKeyDown={(e) => { e.key == "Enter" && handleSubmit("OUT", e.key) }} placeholder='Comment' required />
                  <button style={{ cursor: isLoading ? "not-allowed" : "pointer", backgroundColor: isLoading ? "gray" : "red" }} disabled={isLoading} onClick={() => handleTransaction('OUT')}>{isLoading ? "processing . .  . ." : "OUT"}</button>
                </div>


              </div>}
            </div>


            <ToastContainer />
          </div>


        </div>
      }
    </>
  );
}

export default NewTransaction;
