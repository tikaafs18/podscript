import React from "react";
import { Text, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../helper";
import { loginAction } from "../Actions/userAction";


const VerificationPage = () => {

    const [coba, setCoba] = React.useState(true);
    const [cobaResend, setCobaResend] = React.useState(true);
    const [successResult, setSuccessResult] = React.useState('');

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const handleVerified = async () => {
        setCoba(!coba);
        try {
            let res = await Axios.patch(`${API_URL}/auth/verified`, {}, {
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            })

            if (res.data.success) { 
                setSuccessResult(res.data.success);
                localStorage.setItem('userLog', res.data.dataLogin.token); 
                delete res.data.dataLogin.token; 
                dispatch(loginAction({ ...res.data.dataLogin, login: "true" })); 
            } else {
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