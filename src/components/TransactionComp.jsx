// import React from 'react'
// import { useState } from 'react'
// import Swal from 'sweetalert2'
// import CustomModal from '../mui_comps/CustomModal'
// // import { SlOptionsVertical } from 'react-icons/sl'
// // import api from '../api_source'
// const TransactionComp = ({ type, amount, date, dis, show }) => {
//    date=String(date)
//    const d = new Date(date);
// let dateString=d.toLocaleString("en-IN")
//   // to display the popUp
//   const [click, Setclick] = useState(false)
//   const showDetails = (amount, date, dis, type) => {
//     Setclick(true)
//     Swal.fire({

//       showConfirmButton: false,
//       showCloseButton: false,
//       padding: "0px",
//       background: "black",
//       width: "320px",
//       allowOutsideClick: true,
//       // showCloseButton: true,

//       html:
//         ` <div style="  display: grid;
//         background-color: black;
//         width: 100%;
//         color: white;
//         position: inharit;
//         top: 15%;
//         left: 33%;
//         height: 100%;
//         font-family: monospace;
//         font-size: large;
//         border-radius: 10px;">
//             <h2 style="text-align: center;
//             border-radius: 7px;
//             padding: 10px 0px;
//             margin-top: 0;
//             width: 100%;
//             margin-bottom: 15px;
//             background-color: rgb(48, 44, 44);
//             color:white; text-align: center;
//             border-radius: 7px;
//             padding: 10px 0px;
//             margin-top: 0;
//             width: 100%;
//             margin-bottom: 15px;
//             background-color: rgb(48, 44, 44);
//             color:white;
//           ">${amount}</h2>

//             <div style=" display: flex;
//             text-align: center;
//             width: 100%;
//             background-color: rgb(48, 44, 44);
//             border-radius: 10px 10px 0px 0px;"> <span style="margin-left: 5%;
//       padding: 10px;
//       padding-top: 13px;
//       text-align: center;
//       overflow: auto;color:white;">Date :</span> <span style="margin-left: 5%;
//       padding: 10px;
//       padding-top: 13px;
//       text-align: center;
//       overflow: auto; color:white;"> ${dateString}</span></div>
//             <div style=" display: flex;
//             text-align: center;
//             width: 100%;
//             background-color: rgb(48, 44, 44);
//             text-align: center;"> <span style="margin-left: 5%;
//       padding: 10px;
//       padding-top: 13px;
//       text-align: center;
//       overflow: auto;">Discryption :</span> <span style="margin-left: 5%;
//       padding: 10px;
//       padding-top: 13px;
//       text-align: center;
//       overflow: auto;"> ${dis}</span> </div>
//             <div style="display: flex;
//             text-align: center;
//             padding-bottom:15px;
//             border-radius: 0px 0px 10px 10px;
//             width: 100%;
//             background-color: gray;
//             text-align: center;
//           "> <span style=" margin-left: 5%;
//       padding: 10px;
//       padding-top: 13px;
//       text-align: center;
//       overflow: auto;">Type :</span> <span style="margin-left: 5%;
//                 padding: 10px;
//                 padding-top: 13px;
//                 text-align: center;
//                 overflow: auto;"> ${type}</span> </div>    
//         </div>`
//     })
//   }

//   return (
//     <>
//       {/* {click && <div>{() => showDetails(amount, date, dis, type)}</div>} */}
//       <CustomModal/>
//       <div onClick={() => showDetails(amount, date, dis, type)} className={`Transaction-comp ${type}`}>
//         <div className="tc-amt">₹{amount}</div>
//         <p className='tc-date'>{date}</p> 
//       </div>
//     </>
//   )
// }

// export default TransactionComp



import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const textStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  heigh: "15px",
  WebkitLineClamp: '1',
  fontFamily: "Poppins",
  width: "50%"
}

const CustomModal = ({ isOpen, handleClose, amount, date, dis, type }) => {
  const formattedDate = new Date(date).toLocaleString('en-IN');

  return (
    <Dialog open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      width="sm"
      TransitionComponent={Transition}
      style={{ backdropFilter: "blur(5px)" }}
      PaperProps={{
        style: {
          fontFamily: "Poppins",
          // backgroundColor: '#1E1E1E',
          backgroundColor: '#1E1E1E',
          color: "white",
          borderRadius: "25px",
          maxWidth: "310px"
        },
      }}
      fullWidth>
      <DialogTitle style={{ fontSize: "x-large" }} align='center' color={"rgb(20, 241, 149)"}>Transaction Details</DialogTitle>
      <hr />
      <DialogContent>
        <Stack sx={{ width: "98%", marginLeft: "auto", marginRight: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <strong color='white'>Amount :</strong> <Typography noWrap color={"white"}> ₹ {amount}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>

            <strong color='white'>Date : </strong> <Typography color={"white"}> {formattedDate}</Typography>
          </Box>
          <Box sx={{ width: "99%", display: "flex", overflow: "hiden", justifyContent: "space-between" }}>
            <strong color='white'>Description : </strong> <Typography noWrap style={textStyle}> {dis} sdfshfkskdfkjsdhfsd</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <strong color='white'>Type : </strong> <Typography color={"white"}>{type}</Typography>
          </Box>

        </Stack>
      </DialogContent>

      <DialogActions sx={{ display: "flex", width: "85%", marginLeft: "auto", marginRight: "auto", justifyContent: "space-between", padding: "12px" }}>

        <Button variant='outlined' style={{ border: "2px solid rgb(20, 241, 149)", color: "black", backgroundColor: "rgb(20, 241, 149)", hover: { backgroundColor: "rgb(20, 241, 149)", color: "black" } }} >{"edit"}</Button>
        <Button color='success' style={{ backgroundColor: "black", color: "rgb(20, 241, 149)" }} variant='success' onClick={handleClose}>OK</Button>
      </DialogActions>

    </Dialog>
  );
};




const TransactionComp = ({ type, amount, date, dis }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CustomModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        amount={amount}
        date={date}
        dis={dis}
        type={type}
      />
      <div onClick={showDetails} className={`Transaction-comp ${type}`}>
        <div className="tc-amt">₹{amount}</div>
        <p className="tc-date">{date}</p>
      </div>
    </>
  );
};

export default TransactionComp;
