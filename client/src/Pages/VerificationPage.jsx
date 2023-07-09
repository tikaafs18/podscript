import React from "react";
import { Text, Button, useToast, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../helper";
import { loginAction } from "../Actions/userAction";


const VerificationPage = (props) => {

    const [coba, setCoba] = React.useState(true);
    const [cobaResend, setCobaResend] = React.useState(true);
    const [verifikasi, setVerifikasi] = React.useState('');
    const [successResult, setSuccessResult] = React.useState('');

    const params = useParams();
    // console.log(params.token)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const global = useSelector((state) => {
        return {
            idusers: state.userReducer.idusers,
            status: state.userReducer.status,
            username: state.userReducer.username,
            email: state.userReducer.email,
            login: state.userReducer.login
        }
    })

    // console.log('Ini global di verification page :', global)

    const handleVerified = async () => {
        console.log('handleverified is working')
        setCoba(!coba);
        try {
            let res = await Axios.patch(`${API_URL}/auth/verified`, {}, {
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            })

            if (res.data.success) { // Jika success maka auto login
                console.log('Ini token handleverified (userlog) :', res.data.dataLogin.token)
                console.log('handleverified sukses is working', res.data.success)
                console.log('handleverified sukses res.data is working', res.data)

                setSuccessResult(res.data.success);
                localStorage.setItem('userLog', res.data.dataLogin.token); // token disimpan ke localStorage
                delete res.data.dataLogin.token; // properti token dihapus
                dispatch(loginAction({ ...res.data.dataLogin, login: "true" })); // data user disimpan ke reducer
            } else {
                console.log('handleverified failed is working', res.data.success)
                console.log('handleverified sukses res.data is working', res.data)

                setSuccessResult(res.data.success);
                setCoba(coba);
            }

        } catch (error) {
            setCoba(coba);
        }
    }

    React.useEffect(() => {
        handleVerified()
    }, [])

    console.log('Ini hasil cek verifikasi :', successResult)


    const handleResendLink = () => {
        setCobaResend(!cobaResend);
        Axios.post(API_URL + '/auth/resendlink', {
            // global.email
        })

            .then((res) => {
                const test = () => {
                    if (res.data.success) {
                        toast({
                            title: 'Email verification has been sent.',
                            description: 'Please check your mailbox for account verification.',
                            status: 'success',
                            duration: 3000,
                            isClosable: true
                        });
                        setCobaResend(cobaResend);
                    }
                }
                setTimeout(test, 3000);
                localStorage.setItem('userLog', res.data.token);
                // console.log('3. Ini token verif page, cek res.data.token :', res.data.token)
            }).catch((err) => {
                setCobaResend(cobaResend);
                console.log(`Axios post (resendLink) failed : ${err}`)
            })

    }


    return <div style={{ background: '#151033', color: 'white', textAlign: 'justify', minHeight: '75vh' }}>
        <div className="container p-5">
            <div className="w-75 my-5">

                {
                    successResult ?
                        <div>
                            <Text fontSize='5xl' className="fw-bold pt-5 mb-3">Account Verification Success</Text>

                            <Text fontSize='5xl' className="fw-bold pt-3 mb-3">Redirecting to your account...</Text>
                            {setTimeout(() => { navigate('/homepage', { replace: true }) }, 5000)}
                        </div>
                        : <div>
                            <Text fontSize='5xl' className="fw-bold pt-5 mb-3">This link is expired.</Text>
                            <Text fontSize='5xl' className="fw-bold pt-5 mb-3">Please resend another verification email by logging in to your account.</Text>
                        </div>
                }
            </div>
        </div>
    </div>
}

export default VerificationPage;