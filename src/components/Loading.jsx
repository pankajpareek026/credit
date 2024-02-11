import React from "react";
import "../loading.css";
import { RingLoader } from "react-spinners";
export default function Loading({ margin }) {
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
}
