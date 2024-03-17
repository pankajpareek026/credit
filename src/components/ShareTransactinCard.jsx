import React from 'react';
import NorthWestIcon from "@mui/icons-material/NorthWest";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

export default function ShareTransactionCard({
  message, date, amount, type
}) {
  return (
    <div className="transaction-card-in-share">
      {type == "recived" ? (
        <ArrowCircleDownIcon sx={{ color: "green", marginLeft: "5px" }} />
      ) : (
        <ArrowCircleUpIcon
          sx={{ color: "rgb(255, 0, 111)", marginLeft: "5px" }}
        />
      )}
      <div>
        {/* <span className="sender-reciver-name">anuj</span> */}
        <span className="sender-reciver-transaction-comment">{message}</span>
        <span className="transaction-date">{date}</span>
      </div>
      <span className="share-transaction-amount"> ₹ {amount}</span>
    </div>
  );
}
