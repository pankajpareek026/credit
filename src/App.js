// import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Navbar from './components/Navbar';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Footer from './components/Footer';
import Dashboard from './pages/DashboardPage';
import Transactions from './pages/TransactionsPage';
import Protected from './components/Protected';
import Private from './components/Private';
import Detail from './components/Detail';
import ShareTransactions from './pages/ShareTransactionsPage';
import UserProfile from './pages/UserProfilePage';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});


function App() {
  //   document.addEventListener('contextmenu', (e) => e.preventDefault());

  // function ctrlShiftKey(e, keyCode) {
  //   return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
  // }

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
    <theme>
      <div className="app">

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/share/:source' element={<ShareTransactions />} />
            <Route element={<Private />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Route>
            <Route element={<Protected />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/detail/:id' element={<Transactions />} />

              {/* <Route path='/me' element={<UserProfile />} /> */}
            </Route>
            <Route path='/me' element={<UserProfile />} />

            <Route path="/*" element={<h1> Error 404 Page not Found </h1>} />
          </Routes>

        </BrowserRouter>
      </div>
    </theme>
  );
}

export default App;
