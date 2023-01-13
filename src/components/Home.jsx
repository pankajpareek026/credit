import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
const Home = () => {
    const isUser=localStorage.getItem('user')
    const redirect = useNavigate()
    document.title="C | HOME"

    return (
<>
<Navbar/>
        <div className="home">
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="white" fill-opacity="1" d="M0,0L48,48C96,96,192,192,288,229.3C384,267,480,245,576,197.3C672,149,768,75,864,74.7C960,75,1056,149,1152,186.7C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg> */}


            <div className="title">
                <h2>Track Your Credits Digitaly ,
                    say goodbay to khata's and books .
                </h2>
              {  <button className='get-btn' style={{display:isUser?"none":"flex"}} onClick={() => redirect('/login')}>Get started</button>}
                <img className='title-img' style={isUser&&{marginTop:"5rem"}} src="https://cdn1.designhill.com/uploads/personal_designs/6eab37b4c0aff0a81cb41bbcba7dd97a-4ff20032494dc4cdb094b2dfbfebae6216299591083257.png?ver=2.12.17" alt="img" />
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
