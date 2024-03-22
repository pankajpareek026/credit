import React, { useState, useRef, useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import api from "../api_source";
import CustomModal from "../mui_comps/CustomModal";
import MuiInputBox from "../mui_comps/MuiInputBox";
import { ToastContainer } from "react-toastify";
import Loading from "./Loading";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";


const AddUser = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false) // for loading animation
  const inputRef = useRef(null)


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);


  // save clients in database
  const createUser = async (name) => {
    const parentId = localStorage.getItem("user");
    if (parentId) {
      setLoading(true);
      fetch(`${api}/addClient`, {
        method: "post",
        headers: { "content-type": "application/json", token: `${parentId}` },
        body: JSON.stringify({ parentId, name }),
        credentials: "include",
        mode: 'cors'
      })
        .then(response => response.json())
        .then((result) => {
          if (result.isSuccess) {
            SuccessToast(`${result.message}`);
            refresh(); // to call all users api function in dashboard ;
            setOpen(false) // close modal after user creation
            setNewClientName("")
            return
          }
          return ErrorToast(result.message)
        })
        .finally(() => {
          setLoading(false)// stop loading animation
          setIsError(false);
          setIsLoading(false)
          setErrorMessage("")
        })
        .catch(error => ErrorToast(error.message));
    }
  };
  const addUserHandle = async () => {
    if (!newClientName.length > 0) {
      setIsError(true);
      setErrorMessage("client name is required");
      return;
    }
    setIsLoading(true);
    createUser(newClientName)
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const openModal = () => {
    setOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }

  }
  const closeModal = () => {
    setIsError(false);
    setErrorMessage("")
    setNewClientName("")
    setOpen(false)
  }


  return (
    <div className="add-user-icon-container" onClick={() => setOpen(true)}>
      <Loading
        isLoading={loading}
        isSimpleLoading={true}
        isFullPageLoading={false}
      />

      <PersonAddIcon fontSize="large" onClick={() => openModal()} />

      <CustomModal
        openModal={open}
        isTitle={true}
        title={"Add new client"}
        setOpenModal={setOpen}
        closeModal={closeModal}
        modalType={"success"}
        isFirstButton={true}
        firstButtonName={"cancel"}
        firstOnClick={closeModal}
        secodOnClick={addUserHandle}
        firstButtonType={"close"}
        isSecondButton={true}
        secondButtonName={"Add"}
        secodButtonType={"action"}
        isSecondLoading={isLoading}
        closeOutSideClick={false}
        content={
          <MuiInputBox
            label={"Enter new client name"}
            onChangeFn={setNewClientName}
            isError={isError}
            inpValue={newClientName}
            errorInfo={errorMessage}
            isRequired={true}
            ref={inputRef}
            onKeyPress={(e) => { e.key == "Enter" && addUserHandle(e) }}
          />
        }
      />
      <ToastContainer />
    </div>

  );
};

export default AddUser
