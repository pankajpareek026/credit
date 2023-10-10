import React from "react";
import "../loading.css";
import { RingLoader } from "react-spinners";
const Loading = ({ margin }) => {
  return (
    <div
      style={
        margin && {
          margin: margin,
        }
      }
      className="cont"
    >
      <div className="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
