import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import Svg from './SvgComponent';
const Home = () => {
    const isUser=localStorage.getItem('user')
    const redirect = useNavigate()
    document.title="Credit | HOME"

    return (
<>
<Navbar/>
        <div className="home">
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="white" fill-opacity="1" d="M0,0L48,48C96,96,192,192,288,229.3C384,267,480,245,576,197.3C672,149,768,75,864,74.7C960,75,1056,149,1152,186.7C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg> */}

<Svg></Svg>
            <div className="title">
                svg
                <h2>Track Your Credits Digitaly ,
                    say goodbay to khata's and books .
                </h2>
              {  <button className='get-btn' style={{display:isUser?"none":"flex"}} onClick={() => redirect('/login')}>Get started</button>}
                {/* <img className='title-img' style={isUser&&{marginTop:"5rem"}} src="https://cdn1.designhill.com/uploads/personal_designs/6eab37b4c0aff0a81cb41bbcba7dd97a-4ff20032494dc4cdb094b2dfbfebae6216299591083257.png?ver=2.12.17" alt="img" /> */}
             < svg/>
            </div>
            
            
            <div className="one">
                <h1>Who We Are ?</h1>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum corrupti pariatur incidunt voluptatibus sed corporis architecto delectus molestiae ut facilis, obcaecati, totam non tempora unde nemo nisi. Expedita veniam commodi blanditiis a quibusdam eum facere saepe obcaecati illo sequi delectus alias inventore, vitae quo quisquam ab nemo esse quas provident.
                </div>
               
            <div className="two">
                <h1>Visoin</h1>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem cum autem provident maiores ipsam doloribus! Esse commodi tempora numquam aut exercitationem vel accusamus temporibus ullam adipisci doloremque? Provident consectetur natus, aperiam cupiditate perferendis deleniti doloribus perspiciatis enim assumenda corrupti inventore soluta necessitatibus aliquam! Inventore eaque architecto obcaecati. Doloremque obcaecati iste dolor? Odit aspernatur dicta inventore natus impedit atque sunt dolorum aperiam ea, ipsa optio pariatur quisquam obcaecati doloribus temporibus exercitationem nisi facere assumenda modi placeat explicabo rem reprehenderit possimus! Suscipit, impedit, dolor esse possimus commodi sapiente rem magni optio quaerat, soluta cumque dolorum doloremque molestiae saepe aliquid accusamus. Esse, dolores.
            </div>

            <div className="events">
                <h1>Events</h1>
                <div className="event-container">
                    <div className="event"> Lorem ipsum dolor sit amet. Ea voluptates pariatur ducimus excepturi. </div>
                    <div className="event"> Lorem ipsum dolor sit amet. Ea voluptates pariatur ducimus excepturi. </div>
                    <div className="event"> Lorem ipsum dolor sit amet. Ea voluptates pariatur ducimus excepturi. </div>
                    <div className="event"> Lorem ipsum dolor sit amet. Ea voluptates pariatur ducimus excepturi. </div>
                </div>
            </div>



        </div>
        <Footer/>
        </>
    )
}
export default Home;
// import credit0 from '/public/img.jpg'
// import credit1 from 'public\img2.jpg'

// import React from 'react';

// const HomePage = () => {
//   return (
//     <div>
//       <header style={styles.header}>
//         <nav style={styles.nav}>
//           <div style={styles.logo}>Credit Record</div>
//           <ul style={styles.menu}>
//             <li style={styles.menuItem}>Home</li>
//             <li style={styles.menuItem}>About</li>
//             <li style={styles.menuItem}>Services</li>
//             <li style={styles.menuItem}>Partners</li>
//             <li style={styles.menuItem}>Contact</li>
//           </ul>
//         </nav>
//       </header>

//       <section style={styles.heroSection}>
//         <div style={styles.heroText}>
//           <h1 style={styles.heroTitle}>Welcome to Credit </h1>
//           <p style={styles.heroSubtitle}>
//             Check your credit score and manage your financial records with ease.
//           </p>
//           <button style={styles.heroButton}>Get Started</button>
//         </div>
//         <div style={styles.heroImage}>
//           <img
//             src={credit0}
//             alt="Credit Score"
//             style={styles.heroImage}
//           />
//         </div>
//       </section>

//       <section style={styles.partnerSection}>
//         <h2 style={styles.sectionTitle}>Our Payment Partners</h2>
//         <div style={styles.partnerCards}>
//           <div style={styles.partnerCard}>
//             <img
//               src="/images/partner1.png"
//               alt="Partner 1"
//               style={styles.partnerImage}
//             />
//           </div>
//           <div style={styles.partnerCard}>
//             <img
//               src="/images/partner2.png"
//               alt="Partner 2"
//               style={styles.partnerImage}
//             />
//           </div>
//           <div style={styles.partnerCard}>
//             <img
//               src="/images/partner3.png"
//               alt="Partner 3"
//               style={styles.partnerImage}
//             />
//           </div>
//         </div>
//       </section>

//       <section style={styles.cryptoSection}>
//         <h2 style={styles.sectionTitle}>Crypto Payment Options</h2>
//         <div style={styles.cryptoCards}>
//           <div style={styles.cryptoCard}>
//             <img
//               src="/images/bitcoin.png"
//               alt="Bitcoin"
//               style={styles.cryptoImage}
//             />
//           </div>
//           <div style={styles.cryptoCard}>
//             <img
//               src="/images/ethereum.png"
//               alt="Ethereum"
//               style={styles.cryptoImage}
//             />
//           </div>
//           <div style={styles.cryptoCard}>
//             <img
//               src="/images/litecoin.png"
//               alt="Litecoin"
//               style={styles.cryptoImage}
//             />
//           </div>
//         </div>
//       </section>

//       <footer style={styles.footer}>
//         <p style={styles.footerText}>© 2023 Credit Record. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// const styles = {
//   header: {
//     backgroundColor: '#3f51b5',
//     padding: '16px',
//   },
//   nav: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   logo: {
//     color: '#fff',
//     fontSize: '24px',
//     fontWeight: 'bold',
//   },
//   menu: {
//     listStyle: 'none',
//     display: 'flex',
//     gap: '16px',
//   },
//   menuItem: {
//     color: '#fff',
//     cursor: 'pointer',
//   },
//   heroSection: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '80px',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   heroText: {
//     flex: '1 1 50%',
//     marginRight: '80px',
//   },
//   heroTitle: {
//     fontSize: '48px',
//     fontWeight: 'bold',
//     marginBottom: '16px',
//   },
//   heroSubtitle: {
//     fontSize: '24px',
//     marginBottom: '24px',
//   },
//   heroButton: {
//     backgroundColor: '#3f51b5',
//     color: '#fff',
//     padding: '12px 24px',
//     borderRadius: '4px',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '18px',
//     fontWeight: 'bold',
//   },
//   heroImage: {
//     width: '100%',
//     height: 'auto',
//     maxWidth: '400px',
//   },
//   partnerSection: {
//     backgroundColor: '#f5f5f5',
//     padding: '80px',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   sectionTitle: {
//     fontSize: '36px',
//     fontWeight: 'bold',
//     marginBottom: '40px',
//   },
//   partnerCards: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     gap: '40px',
//   },
//   partnerCard: {
//     backgroundColor: '#fff',
//     padding: '16px',
//     borderRadius: '8px',
//     boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
//     width: '200px',
//   },
//   partnerImage: {
//     width: '100%',
//     height: 'auto',
//   },
//   cryptoSection: {
//     backgroundColor: '#fff',
//     padding: '80px',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   cryptoCards: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     gap: '40px',
//   },
//   cryptoCard: {
//     backgroundColor: '#f5f5f5',
//     padding: '16px',
//     borderRadius: '8px',
//     boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
//     width: '200px',
//   },
//   cryptoImage: {
//     width: '100%',
//     height: 'auto',
//   },
//   footer: {
//     backgroundColor: '#3f51b5',
//     padding: '16px',
//     marginTop: '80px',
//     textAlign: 'center',
//     color: '#fff',
//   },
//   footerText: {
//     fontSize: '14px',
//   },
// };

// export default HomePage;


