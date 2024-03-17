import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import '../HomePage.css';
import { useSelector } from "react-redux";

const Home = () => {
  const loginInfo = useSelector(data => data.auth.status)
  console.log("LI =>", loginInfo)
  const redirect = useNavigate();
  document.title = "Credit | HOME";
  const gettingStartedHandle = () => {
    if (loginInfo) {
      redirect("/dashboard")
      return
    }
    redirect("/login")
  }
  const features = [
    {
      title: 'User-Friendly UI',
      content: '"Credit" offers a user interface reminiscent of the simplicity and ease of use found in WhatsApp. Users can effortlessly navigate through the apps features and functionalities, enjoying a familiar and intuitive experience akin to their favorite messaging platform.'
    }, {
      title: 'Data Encryption',
      content: 'All data stored and transmitted within "Credit" is encrypted, providing an additional layer of security.This encryption protects users financial information from unauthorized access, enhancing confidentiality and trust in the app.'
    },
    {
      title: 'Share Transaction Feature',
      content: '"Credit" introduces a unique Share Transaction feature, allowing users to generate a secure link to all transactions associated with a particular client.With this feature, users can easily share a comprehensive overview of transactions with clients or stakeholders without requiring them to log in to the app.The generated link provides convenient access to transaction details while maintaining security and confidentiality, ensuring transparency and facilitating collaboration with external parties.'
    },

  ]
  return (
    <>
      <div className="home-page">
        <Navbar />

        <section className="first-section">

          <div className="first-heading">
            Ready to simplify your finances ?
          </div>


          <button onClick={gettingStartedHandle} className="started-btn">{loginInfo ? "Dashboard" : "Getting Started"} &#8594; </button>

        </section>
        {/* screen shot  */}
        <section className="second-section">

          <h3>Why credit ?</h3>
          <hr />


          <div className="features-container">
            {
              features.map(({ title, content }, index) => {
                return (
                  <div className="feature">
                    <h3>{index + 1 + ". "}{title}</h3>
                    <hr />
                    <span className="content-span">
                      {content}
                    </span>
                  </div>
                )
              })
            }
          </div>

        </section>



      </div>
      {/* <Footer /> */}
    </>
  );
};
export default Home;







{/* <div className="home-page">

<section className="section-one">
  <canvas class="webgl-canvas" data-engine="three.js r158" width="2608" height="1372" style="width: 1304px; height: 686px;"></canvas>
  <div className="section-one-inner-card-container">
    <span className="title">
      {" "}
      <p>Ready to simplify your finances</p>
      <>
        {!isUser ? (
          <button className="btn" onClick={() => redirect("/register")}>
            {" "}
            <Link to={"/register"}></Link>
            Get started &#x2192;
          </button>
        ) : (
          <button className="btn" onClick={() => redirect("/dashboard")}>
            {" "}
            <Link className="btn" to={"/dashboard"}></Link>
            Dashboard &#x2192;
          </button>
        )}
      </>
    </span>
    <img src={rightImage} alt="" />
  </div >
</section >
<section className="section-two">
  <h2 className="title">Why Should You Use Credit</h2>
</section>
</div> */}