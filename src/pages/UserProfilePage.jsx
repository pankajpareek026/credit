import React, { useEffect, useRef, useState } from 'react'
import AdvanceNav from '../components/AdvanceNav';
import { userPageNavigationData } from '../data/navigationData';
import { CopyAllOutlined, DeleteForever } from '@mui/icons-material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LinkCard from '../components/LinkCard';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CustomModal from '../mui_comps/CustomModal';
import Warning from '../components/Warning';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import api from '../api_source';
import Error from '../components/Error';
import { ToastContainer, toast } from 'react-toastify';
import Success from '../components/Success';
import { Box, FormLabel, Input, Typography, TextField, CircularProgress } from '@mui/material';
import MuiInputBox from '../mui_comps/MuiInputBox';
// import Modal from '../components/Modal';
// import NextModal from '../nextUI components/NextModal';
// CustomModal

function UserProfile() {

  const settings = ["Change password", "Change username", "Change email", "Delete account",]
  const links = [
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 1', linkStatus: true },
    { name: 'Example 2', linkStatus: false },

    // Add more objects as needed
  ];
  const Auth = window.localStorage.getItem('user');
  const [allClients, SetClients] = useState([])
  const [sharedLinks, setSharedLinks] = useState([]);
  const [userName, SetUserName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [copyIndex, setCopyIndex] = useState()
  const [open, setOpen] = useState(false)
  const [deleteLinkId, setDeleteLinkId] = useState()
  const [newClientName, setNewClientName] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [clientCurrentName, setClientCurrentName] = useState(true)
  const [clientId, setClientId] = useState("")
  const [isFirstLoading, setIsfirstLoading] = useState(false)
  const [isSecondBtnLoading, setIsSecondBtnLoading] = useState(false)
  const [isEmptyError, setIsEmptyError] = useState(false)
  const [firstLoadingBtnText, setFirstBtnLoadingText] = useState(false)
  const [secondBtnLoadingText, setSecondBtnLoadingText] = useState(false)
  const [isDeleteClientModal, setisDeleteClientModal] = useState(false)
  const copyRef = useRef()
  const deleteRef = useRef()

  const copyLink = (link, index) => {
    // console.log("REF=>", ref)
    window.navigator.clipboard.writeText(link)
    setIsCopied(true)
    setCopyIndex(index)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)


  }

  // call api to delete link
  const deleteLinkParmanent = () => {
    console.log('deleteLinkParmanent')
    try {
      fetch(`${api}/deleteSharedLink`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          shareid: deleteLinkId,
          token: Auth
        },
        credentials: "include"
      })
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          if (data.type === "error") return Error(data.message);
          Success(data.message);
          getData();
        })

    } catch (error) {
      Error(error.message)
      console.error(error.message);
    }
    setOpen(false)

    setDeleteLinkId("")
  }


  // function to display confirm delete link modal
  const deleteLink = (linkId) => {
    console.log("delete linkID", linkId);
    setOpen(true)
    setDeleteLinkId(linkId)
  }

  // open modal to change client name
  const editClientName = (clientName, clientId) => {
    console.log(" clientName=>", clientName, "clientId =>", clientId);
    setClientCurrentName(clientName)
    setShowEditModal(true);
    setClientId(clientId);
  }

  // function to close edit client name modal
  const closeEditModal = () => {
    setShowEditModal(false)
    setIsSecondBtnLoading(false)
    setNewClientName("")
    setClientId("")
    setIsEmptyError(false)
  }
  // make API request to change client name
  const saveNewClientName = async (clientId, currentName, newName) => {
    try {
      // Check if new name is empty
      if (!newName) {
        // Set error state and return
        return setIsEmptyError(true);
      }

      // Clear error state
      setIsEmptyError(false);

      // Set loading state and text
      setIsSecondBtnLoading(true);
      setSecondBtnLoadingText("Saving");

      // Log function call
      console.log("Save function called");

      // Make PUT request to update client name
      fetch(`${api}/editClient`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "token": Auth
        },
        credentials: "include",
        body: JSON.stringify({
          "clientId": clientId,
          "newName": newName,
          "currentName": currentName,
        })
      })
        // Parse response as JSON
        .then(response => response.json())
        .then(data => {
          // If request is successful
          if (data.type === "success") {
            // Show success message
            Success(data.message);
            // Clear loading state
            setIsSecondBtnLoading(false);
            // Hide edit modal
            setShowEditModal(false);
            // reset client new name
            setNewClientName("")
            // reset clientId
            setClientId("")
            // resset error message
            setIsEmptyError(false)
            // Refresh data
            getData();
            return;
          }
          Error(data.message);
        })
        // Handle errors
        .catch(err => Error(err.message))
        // Finally, clear loading text
        .finally(() => {
          setIsSecondBtnLoading(false);
        });
    } catch (error) {
      // Log and handle errors
      console.log("Error: ", error);
      Error(error.message);
    }
  };

  const deleteClientPermanently = async () => {
    try {
      setIsSecondBtnLoading(true)
      console.log("clientId", clientId);
      console.log("clientName", clientCurrentName)
      fetch(`${api}/deleteClient`, {
        method: 'DELETE',
        headers: {
          "content-type": "application/json",
          "token": Auth,
          "clientid": clientId
        },
        credentials: "include"
      })
        .then(response => response.json())
        .then((deleteResponse) => {
          console.log("deleteResponse=>>", deleteResponse)
          if (deleteResponse.type === "success") {
            Success(deleteResponse.message)
            closeDeleteModal();
            getData()
            return
          }
          return Error(deleteResponse.message)
        }).catch((error) => {
          Error(error.message)
        })
        .finally(() => {
          setIsSecondBtnLoading(false)
        })
    } catch (error) {
      console.log("Error: ", error);
      Error(error.message);
    }

  }

  const closeDeleteModal = () => {
    setIsSecondBtnLoading(false)
    setisDeleteClientModal(false)
    setClientCurrentName("")
    setClientId("")
  }

  const deleteClientModalHandle = (clientId, clientName) => {
    console.log("clientId: ", clientId, "clientName: ", clientName);
    setisDeleteClientModal(true)
    setClientCurrentName(clientName)
    setClientId(clientId)
  }

  // get all data for profile page
  const getData = async () => {
    try {
      fetch(`${api}/userProfile`, {
        method: 'GET',
        headers: {
          "content-type": "application/json",
          token: Auth,
        },
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          console.log("data=>", data)
          if (data.status == "ok") {
            const { allSharedLinks, allClients, symbol, name } = data
            setSharedLinks(allSharedLinks)
            SetClients(allClients)
            SetUserName(name)
            setSymbol(symbol)
          }
        })
        .catch(err => {
          Error(err.message)
        })

    } catch (error) {
      Warning("Failed to fetch")
    }
  }
  const editUserName = (user) => {

  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='dashboard profile'>
      <AdvanceNav isDashboard={true} isAddUser={false} navData={userPageNavigationData} />
      {/* profile right section which contains all data of profile and all */}
      <section className='profile-right-sec'>

        {/* left container --start */}
        <section className="left-container">

          {/* modal to delete links */}
          <CustomModal
            isTitle={true}
            openModal={open}
            setOpenModal={setOpen}
            modalType={"confirm"}
            title={"delete Link"}
            content={"link will be deleted parmanatly you can't restore it"}
            firstButtonType={"error"}
            firstButtonName={"Cancel"}
            secondButtonName={"Delete"}
            isFirstButton={true}
            isSecondButton={true}
            secodOnClick={() => deleteLinkParmanent()}
          />

          {/* modal to edit client name */}
          <CustomModal
            isTitle={true}
            openModal={showEditModal}
            setOpenModal={closeEditModal}
            modalType={"input"}
            title={`Change client name`}
            // content={"link will be deleted parmanatly you can't restore it"}
            content={
              <Box display={"grid"} h={"auto"} m={1} gap={1.7} p={.2}>
                <MuiInputBox

                  placeHolder={"current name"}
                  inpValue={clientCurrentName}
                  // isDisabled={true}
                  label={"current client name"}
                  isReadOnly={true}
                // isDisabled={true}
                // onChangeFn={setNewClientName}
                />
                <MuiInputBox
                  // InpVariant={"standard"}
                  isRequired={true}
                  placeHolder={"New name"}
                  // inpValue={clientCurrentName}
                  // isDisabled={true}
                  label={"New name"}
                  isReadOnly={false}
                  isError={isEmptyError}
                  errorInfo={"New name is required"}
                  onChangeFn={setNewClientName}
                  inpValue={newClientName}
                  isSecondtLoading={isSecondBtnLoading}
                />
              </Box>
            }
            isSecondLoading={isSecondBtnLoading}
            secondLoadingIcn={<CircularProgress />}
            isFirstLoading={isFirstLoading}
            firstButtonType={"close"}
            secodLoadingIcn={<CircularProgress />}
            firstButtonName={"Cancel"}
            secondButtonName={isSecondBtnLoading ? secondBtnLoadingText : "Save"}
            isFirstButton={true}
            isSecondButton={true}
            secodOnClick={() => saveNewClientName(clientId, clientCurrentName, newClientName)}
          />

          {/* Modal to delete user */}
          <CustomModal
            isTitle={true}
            openModal={isDeleteClientModal}
            setOpenModal={closeDeleteModal} // to hide modal
            modalType={"confirm"}
            title={`Delete client "' ${clientCurrentName} '"`}
            content={`Client  ' ${clientCurrentName} ' will be deleted parmanatly you can't restore it`}
            firstButtonType={"cancel"}
            firstButtonName={"Cancel"}
            secondButtonName={"Delete"}
            isFirstButton={true}
            isSecondButton={true}
            isSecondLoading={isSecondBtnLoading}
            secodOnClick={deleteClientPermanently}
          />


          {/* container which contains user picture and usr name */}
          <div className="left-upper">
            <p className="profile-pic">{symbol}</p>

            <div className="profile-name">{userName}</div>

          </div>


          {/* container which contains all shareable liks created by user */}
          <div className="left-lower">
            <div className="share-link-wrappwer">
              <p>Shared Links</p>
              <hr />
              <div className="share-link-container">
                {
                  (sharedLinks.length > 0) ? (sharedLinks.map((item, index) => {
                    return (
                      <LinkCard key={item.linkId} isStatus={true} isActive={item.isActive} iconOne={<DeleteForever onClick={() => deleteLink(item.linkId)} />} status={item.status} content={item.clientName}
                        iconTwo={
                          (isCopied && copyIndex == index) ? (<CheckCircleSharpIcon color='rgb(20, 241, 149)' />) : (<CopyAllOutlined

                            onClick={(e) => copyLink(`https://creditc.vercel.app/share/${item.linkId}`, index)}

                          />)
                        } />
                    )
                  })) :
                    <LinkCard contentColor={"rgb(255, 0, 111)"} content={"Nothing to display !"} />
                }
              </div>
            </div>
          </div>

        </section>
        {/* left container --end */}



        {/* right container --start */}
        <section className="right-container">

          {/* container which contains all clients associated with user */}
          <div className="right-upper">
            <div className="user-wrapper">
              <div style={{fontWeight:"650",fontSize:"large", display: "flex", justifyContent: "space-between",paddingLeft:"7px", paddingRight: "15px" }}><p>Clients</p><p style={{ marginRight: "5px",fontSize:"1.2rem" }}>{allClients.length}</p></div>
              <hr />
              {/* container that holds all user cards  */}
              <div className="users-container">
                {
                  allClients.length > 0 ? (allClients.map((data, index) => {
                    return (
                      // user cards
                      <LinkCard key={index} iconOne={<BorderColorIcon onClick={() => editClientName(data.name, data._id)} />} status={data["name"]} content={data["name"]} iconTwo={<DeleteForever onClick={() => deleteClientModalHandle(data._id, data.name)} />} />
                    )
                  })) : <LinkCard contentColor={"rgb(255, 0, 111)"} content={"Nothing to display !"} />
                }
              </div>
            </div>
          </div>

          <div style={{ height: "max-content", marginBottom: '250px !important' }} className="right-lower">
            <div className="user-wrapper">
              <p>Profile Settings</p>
              <hr />
              {/* container that holds all user settings cards  */}
              <div className="users-container">
                {
                  settings.map((item, index) => {
                    return (
                      <LinkCard key={index} content={item} isStatus={false} iconTwo={<ArrowRightIcon />} />
                    )
                  })
                }
              </div>
            </div>
          </div>
        </section>
      </section>
      {/* right container --end */}
      <ToastContainer />
    </div>
  )
}

export default UserProfile;