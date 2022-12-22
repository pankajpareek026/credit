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
            <Route path='/d' element={<Detail />} />
          </Route>
          <Route path="/" element={<h1> Error 404 Page not Found </h1>} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
