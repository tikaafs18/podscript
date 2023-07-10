import React from "react";
import { Text, Input, InputGroup, InputRightElement, Button, Icon, useToast, Spinner, FormControl } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../helper";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { loginAction } from "../Actions/userAction";

const ResetPasswordPage = () => {
    const [coba, setCoba] = React.useState(true);
    const [visible, setVisible] = React.useState('password');
    const [visibleC, setVisibleC] = React.useState('password');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [successResult, setSuccessResult] = React.useState('');
    const [cobaResend, setCobaResend] = React.useState(true);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const symbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    const upperCase = /^(?=.*[A-Z]).*$/;
    const number = /^(?=.*[0-9]).*$/;

    const onVisibility = () => {
        if (visible === "password") {
            setVisible("text")
        } else if (visible === "text") {
            setVisible("password")
        }
    }

    const onVisibilityCPW = () => {
        if (visibleC === "password") {
            setVisibleC("text")
        } else if (visibleC === "text") {
            setVisibleC("password")
        }
    }

    const onReset = async () => {
        setCoba(!coba);
        try {
            let res = await Axios.patch(`${API_URL}/auth/verified`, {password}, {
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            })

            if (res.data.success) {
                toast({
                    title: 'Reset password success',
                    description: 'Redirecting to your account...',
                    status: 'success',
                    duration: '3000',
                    isClosable: true
                })
                setSuccessResult(res.data.success);
                localStorage.setItem('userLog', res.data.dataLogin.token);
                delete res.data.dataLogin.token;
                dispatch(loginAction({ ...res.data.dataLogin, login: "true" })); 
                {setTimeout(() => { navigate('/homepage', { replace: true }) }, 5000)}
            } else {
                setCoba(coba);
            }
        } catch (error) {
            setCoba(coba);
        }
    }

    const handleResendLink = () => {
        setCobaResend(!cobaResend);
        Axios.post(API_URL + '/auth/resendlink', {
            emailVerif: global.email
        })
            .then((res) => {
                if (res.data.success) {
                    toast({
                        title: 'Reset password email has been sent.',
                        description: 'Please check your mailbox.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    setCobaResend(cobaResend);
                }
                localStorage.setItem('userLog', res.data.token);
            }).catch((err) => {
                setCobaResend(cobaResend);
                console.log(`Axios post (resendLink) failed : ${err}`)
            })

    }

    return <div className="container">
        <div className="card w-50 m-auto my-5 p-5">
            {
                !successResult ?
                    <>
                        <div className="card-body mt-3">
                            <Text style={{ textAlign: 'center' }} fontSize='xl' className='card-title fw-bold pb-3 border-bottom border-lg-secondary'>Change Password</Text>
                            <Text fontSize='md' className='card-text fw-muted mt-3 mb-4'>Create a new strong password that you don't use for other websites.</Text>

                            <FormControl className="mb-3">
                                <InputGroup>
                                    <InputRightElement
                                        onClick={onVisibility}
                                        children={visible === "password" ?
                                            <AiOutlineEye size={26} />
                                            : <AiOutlineEyeInvisible size={26} />}
                                    />
                                    <Input type={visible} placeholder='Create new password' onChange={(e) => setPassword(e.target.value)} />
                                </InputGroup>
                                {
                                    <div className={password ? "d-block mt-2" : "d-none"}>
                                        <div className="d-flex align-items-center">
                                            {
                                                password.length >= 8 ?
                                                    <div>
                                                        <Icon as={AiOutlineCheckCircle} w={4} h={4} color='green' />
                                                    </div>
                                                    :
                                                    <div>
                                                        <Icon as={AiOutlineCloseCircle} w={4} h={4} color='red' />
                                                    </div>
                                            }
                                            <span className="ms-1" style={password.length >= 8 ? { color: 'green', fontSize: 'small' } : { color: '#FF0000', fontSize: 'small' }}> Min. 8 characters</span>

                                        </div>
                                        <div className="mt-1">
                                            {
                                                upperCase.test(password) && number.test(password) && symbol.test(password) ?
                                                    <Icon as={AiOutlineCheckCircle} w={4} h={4} color='green' />
                                                    :
                                                    <Icon as={AiOutlineCloseCircle} w={4} h={4} color='red' />
                                            }
                                            <span className="ms-1" style={upperCase.test(password) && number.test(password) && symbol.test(password) ? { color: 'green', fontSize: 'small' } : { color: '#FF0000', fontSize: 'small' }} >Contain symbol, uppercase, and number</span>
                                        </div>
                                    </div>
                                }
                            </FormControl>

                            <FormControl className="mb-3">
                                <InputGroup>
                                    <InputRightElement
                                        onClick={onVisibilityCPW}
                                        children={visibleC === "password" ?
                                            <AiOutlineEye size={26} />
                                            : <AiOutlineEyeInvisible size={26} />}
                                    />
                                    <Input type={visibleC} placeholder='Confirm new password' onChange={(e) => setConfirmPassword(e.target.value)} />
                                </InputGroup>

                                <div className={confirmPassword ? "d-block mt-1" : "d-none"}>
                                    <span style={confirmPassword == password ? { display: 'none' } : { color: '#FF0000', fontSize: 'small' }}>Missing confirmation password</span>
                                </div>
                            </FormControl>
                        </div>
                        {
                            coba ? <Button className="mx-3 mb-5" size='sm' colorScheme="pink" variant="solid" onClick={onReset}>Save password</Button>
                                : <Button className="mx-3 mb-5" size='sm' colorScheme="pink" variant="solid" disabled><Spinner size='sm' /></Button>
                        }
                    </>

                    : <div>
                        <Text fontSize='2xl' className="fw-bold pt-5 mb-3">This link is expired.</Text>
                        <Text fontSize='xl' className="fw-muted pt-2 mb-5">Please request another reset password email.</Text>
                        {
                            coba ? <Button className="mx-3 mb-5" size='sm' colorScheme="pink" variant="solid" onClick={handleResendLink}>Resend Reset Password Link</Button>
                                : <Button className="mx-3 mb-5" size='sm' colorScheme="pink" variant="solid" disabled><Spinner size='sm' /></Button>
                        }
                    </div>
            }
        </div>
    </div>
}

export default ResetPasswordPage;