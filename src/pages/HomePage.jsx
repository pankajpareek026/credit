import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../HomePage.css";
import { useSelector } from "react-redux";
import DOTS from 'vanta/dist/vanta.dots.min.js'
import GLOBE from 'vanta/dist/vanta.globe.min.js'

const Home = () => {
    const loginInfo = useSelector((data) => data.auth.status);
    const redirect = useNavigate();
    const vantaRef = useRef(null);
    const vantaRef2 = useRef(null);
    console.log("vantaref=>", vantaRef)

    useEffect(() => {

        vantaRef.current = DOTS({
            el: ".first-section",
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x20ff28,
            color2: "rgb(255, 0, 111)"
        })

        vantaRef2.current = GLOBE({
            el: ".second-section",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: "rgb(20, 241, 149)"
        })
        // Cleanup Vanta.js on component unmount

    }, []);

    const gettingStartedHandle = () => {
        if (loginInfo) {
            redirect("/dashboard");
        } else {
            redirect("/login");
        }
    };

    const features = [
        {
            title: "Simple UI",
            content:
                '"Credit" offers a user interface reminiscent of the simplicity and ease of use found in WhatsApp. Users can effortlessly navigate through the apps features and functionalities, enjoying a familiar and intuitive experience akin to their favorite messaging platform.',
        },
        {
            title: "Data Encryption",
            content:
                'All data stored and transmitted within "Credit" is encrypted, providing an additional layer of security. This encryption protects users financial information from unauthorized access, enhancing confidentiality and trust in the app.',
        },
        {
            title: "Share Transactions ",
            content:
                '"Credit"  introduces Share Transaction, allowing users to generate secure links to client transactions for easy sharing. No app login required. Enhances transparency, collaboration, and confidentiality, enabling seamless communication with clients.',
        },
    ];

    return (
        <>
            <div className="home-page">
                <Navbar />

                <section className="first-section">
                    <div className="first-heading">
                        Ready to simplify your finances ?
                    </div>

                    <button onClick={gettingStartedHandle} className="started-btn">
                        {loginInfo ? "Dashboard" : "Getting Started"} &#8594;{" "}
                    </button>
                </section>

                <section className="second-section">
                    <h3>Why credit ?</h3>
                    <hr />

                    <div className="features-container">
                        {features.map(({ title, content }, index) => {
                            return (
                                <div className="feature" key={index}>
                                    {/* <h3>{index + 1 + ". "}</h3> */}
                                    <h3>{title}</h3>
                                    <hr />
                                    <span className="content-span">{content}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default Home;
