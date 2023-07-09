import './App.css';
import { Routes, Route, useParams } from 'react-router-dom';
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

  let token = localStorage.getItem('userLog');
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();

  let emailVerif = localStorage.getItem('emailLog');
  let params = useParams();

  // console.log('Ini token di app.js :', token)

  const global = useSelector((state) => {
    return {
      idusers: state.userReducer.idusers,
      username: state.userReducer.username,
      email: state.userReducer.email,
      status: state.userReducer.status,
      login: state.userReducer.login
    }
  })


  console.log('Ini global login :', global.login)
  let homepageLog = localStorage.getItem('homepageLog');
  // console.log('Ini homepagelog', homepageLog)
  let userLog = localStorage.getItem('userLog');
  // console.log('Ini token (userLog) keeplogin :', userLog)

  // console.log("Cek boolean global.idusers before keep login", Boolean(global.idusers));

  const keepLogin = () => {
    // console.log("Keep login terus berjalan, meski tanpa iduser dari Local Storage (userLog)");
    // console.log("Cek boolean global.idusers sudah masuk keep login, tapi belum userLog", Boolean(global.idusers));

    let homepageLog = localStorage.getItem('homepageLog');
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
          // console.log('5. Ini token keeplogin, cek res.data :', res.data)
          delete res.data.token;
          setLoading(false);
          dispatch(loginAction({ ...res.data, login: "true" }));
        }).catch((error) => {
          console.log('Ga jelas', error);
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
        // global.status == "UNVERIFIED" && global.login == 'false' ?
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
            {/* <Text fontSize='3xl' className="fw-bold mt-5">Edit Profile</Text> */}
            <Route path='/' element={<HomePage />} />
            <Route path='/homepage' element={<HomePage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/editprofile' element={<EditProfilePage />} />
          </>
          :
          null
      }

      {
        // emailVerif && global.status == "UNVERIFIED" ?
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
