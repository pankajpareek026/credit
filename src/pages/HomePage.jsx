import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import '../HomePage.css';
import rightImage from "../images/gif.gif";
import Svg from "../components/SvgComponent";
const Home = () => {
  const isUser = localStorage.getItem("user");
  const redirect = useNavigate();
  document.title = "Credit | HOME";

  return (
    <>
      <Navbar />
      <section className="section-one">
        <div className="section-one-inner-card-container">
          <span className="title">
            {" "}
            <p>Simple way to manage your money</p>
            <>
              {!isUser ? (
                <button className="btn">
                  {" "}
                  <Link to={"/register"}>Get started &#x2192;</Link>
                </button>
              ) : (
                <button className="btn">
                  {" "}
                  <Link to={"/dashboard"}>Dashboard &#x2192;</Link>
                </button>
              )}
            </>
          </span>
          {/* <img src={rightImage} alt="" /> */}
        </div>
      </section>
    </>
  );
};
export default Home;
