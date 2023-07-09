// import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Protected from './components/Protected';
import Private from './components/Private';
import Detail from './components/Detail';

function App() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());

function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

// document.onkeydown = (e) => {
//   // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
//   if (
//     e.key === 123 ||
//     ctrlShiftKey(e, 'I') ||
//     ctrlShiftKey(e, 'J') ||
//     ctrlShiftKey(e, 'C') ||
//     (e.ctrlKey && e.key === 'U'.charCodeAt(0))
//   )
//     return false;
// };
  return (
    <div className="app">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route element={<Private />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route element={<Protected />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/detail/:id' element={<Transactions />} />
            <Route path='/user' element={<><h1 style={{ color: "white", fontSize: "medium", textAlign: "center", marginTop: "10rem" }}>Under Constraction </h1> <a href='/' style={{ color: "rgb(20, 241, 149)", marginLeft: "50%", textAlign: "center", marginTop: "50rem", fontSize: "15px" }}>/Home</a></>} />
          </Route>
          <Route path="/" element={<h1> Error 404 Page not Found </h1>} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
