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
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { setCredentials } from './features/reducers/authSlice';

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
  const token = localStorage.getItem('user')
  const dispetch = useDispatch()
  if (token?.length > 0) {
    dispetch(setCredentials({ token, status: true }))
  }
  else {
    dispetch(setCredentials({ token: null, status: false }))
  }

  return (
    <theme>
      <div className="app">

        {/* <Provider store={store}> */}
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
              <Route path='/me' element={<UserProfile />} />
              {/* <Route path='/me' element={<UserProfile />} /> */}
            </Route>


            <Route path="/*" element={<h1> Error 404 Page not Found </h1>} />

          </Routes>

        </BrowserRouter>
        {/* </Provider> */}
      </div>
    </theme>
  );
}

export default App;
