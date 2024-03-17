import React from "react";
import { useNavigate } from "react-router-dom";
import fullLogo from '../images/fullLogo.png';
import smallLogo from '../images/smallLogo.png'
export default function Logo({ isAdvanceNav = false }) {
  const redirect = useNavigate();
  return (
    <div
      style={{ cursor: "pointer", marginBottom: "7%" }}
      onClick={() => redirect("/")}
      className={isAdvanceNav ? "logo small" : "logo"}
    >
      {
        isAdvanceNav ?
          <img className="logo2"
            src={smallLogo}
            alt="logo"
            srcset="" />

          :

          <img
            width={"50px"}
            height={"50px"}
            className="logo-image"
            src={isAdvanceNav ? smallLogo : fullLogo}
            alt="logo"
            srcset="" />
      }


    </div>
  );
}
