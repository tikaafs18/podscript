import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Axios from 'axios';
import { API_URL } from './helper';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from './Actions/userAction';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import NotFoundPage from './Pages/NotFoundPage';
import VerificationPage from './Pages/VerificationPage';
import SendEmailPage from './Pages/SendEmailPage';
import ProfilePage from './Pages/ProfilePage';
import EditProfilePage from './Pages/EditProfilePage';
import PostPage from './Pages/PostPage';
import SendResetPasswordPage from './Pages/SendResetPW';
import ResetPasswordPage from './Pages/ResetPW';

function App() {
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();


  const global = useSelector((state) => {
    return {
      idusers: state.userReducer.idusers,
      username: state.userReducer.username,
      email: state.userReducer.email,
      status: state.userReducer.status,
      login: state.userReducer.login
    }
  })

  const keepLogin = () => {
    let userLog = localStorage.getItem('userLog');
    if (userLog) {
      Axios.get(API_URL + '/auth/keep', {
        headers: {
          'Authorization': `Bearer ${userLog}`
        }
      })
        .then((res) => {
          localStorage.setItem('emailLog', global.email);
          localStorage.setItem('userLog', res.data.token);
          delete res.data.token;
          setLoading(false);
          dispatch(loginAction({ ...res.data, login: "true" }));
        }).catch((error) => {
          setLoading(false);
        })
    } else {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    keepLogin()
  }, []);

  return (<div>
    <Navbar />
    <Routes>

      {
        global.idusers && global.status == "UNVERIFIED" ?
          <>
            <Route path='/verification/:token' element={<VerificationPage />} />
            <Route path='/sendemail' element={<SendEmailPage />} />
          </>
          :
          null
      }

      {
        global.login == 'false' ?
          <>
            <Route path='/' element={<LandingPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage loading={loading} />} />
          </>
          :
          null
      }

      {
        global.idusers && global.status ?
          <>
            <Route path='/' element={<HomePage />} />
            <Route path='/homepage' element={<HomePage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/editprofile' element={<EditProfilePage />} />
          </>
          :
          null
      }

      {
        global.status ?
          <>
            <Route path='/verification/:token' element={<VerificationPage />} />
            <Route path='/forgotpassword' element={<SendResetPasswordPage />} />
            <Route path='/resetpassword/:token' element={<ResetPasswordPage />} />
          </>
          : null
      }
      <Route path='/postpage/:idpost' element={<PostPage />} />

      {/* ALL */}
      <Route path='*' element={<NotFoundPage />} />

    </Routes>
    <Footer />
  </div>
  );
}

export default App;
