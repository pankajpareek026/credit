import React from "react";
import { useNavigate } from "react-router-dom"; 

export default function Logo() {
        const redirect = useNavigate();
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => redirect("/")}
      className="logo"
    >
      cred<sub>i</sub>t
    </div>
  );
}
