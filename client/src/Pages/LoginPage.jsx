import React from "react";
import { Spinner, InputGroup, InputRightElement, Text, Input, FormControl, FormLabel, Button, useToast } from "@chakra-ui/react";
import Axios from "axios";
import { API_URL } from "../helper";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAction } from "../Actions/userAction";

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [visible, setVisible] = React.useState('password');
    const [coba, setCoba] = React.useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
 
    const onLogin = () => {
        setCoba(!coba);
        if (password && email || username) {
            setTimeout(() => {
                Axios.post(API_URL + `/auth/login`, {
                    email,
                    username,
                    password
                }).then((res) => {
                    if (res.data.success) {
                        navigate('/homepage', { replace: true });
                        toast({
                            title: 'LOGIN BERHASIL',
                            description: 'Anda berhasil login',
                            status: 'success',
                            duration: 3000,
                            isClosable: true
                        });
                        localStorage.setItem('userLog', res.data.token);
                        localStorage.setItem('profileLog', 'post');
                        localStorage.setItem('emailLog', email);
                        delete res.data.token;
                        dispatch(loginAction({ ...res.data.isiLogin, login: "true" }));
                    } else {
                        setCoba(coba);
                        toast({
                            title: 'LOGIN GAGAL',
                            description: `${email ? "Email" : "Username"} atau password Anda salah`,
                            status: 'error',
                            duration: 3000,
                            isClosable: true
                        });
                    }
                }).catch((err) => {
                    console.log(`Axios get (login) failed : ${err}`)
                })
            }, 3000);
        }
    }

    const onVisibility = () => {
        if (visible === "password") {
            setVisible("text")
        } else if (visible === "text") {
            setVisible("password")
        }
    }

    const check = (e) => {
        let decide = e.target.value;

        if (decide.includes('@' && '.com')) {
            setEmail(decide);
            setUsername('');
        } else if (!decide.includes('@' && '.com')) {
            if (!decide.includes('@') && '.co') {
                setUsername(decide);
                setEmail('');
            }
        }
    }

    return <div style={{ background: '#151033', minHeight: '75vh' }}>
        <div className="container">
            <div className="container p-4 pt-5">
                <div className="row">
                    <div className="col-12 col-md-5 col-lg-6 m-auto pt-5">
                        <Text style={{ color: 'white' }} className="fw-bold mb-3" fontSize="4xl">Sign in and share your moments</Text>
                    </div>
                    <div className="col-12 col-md-7 col-lg-6 pt-5">

                        <div className="card w-100" style={{ color: '#151033' }}>
                            <FormControl className="px-3 pt-4 px-md-5 pt-md-5 mt-md-3">
                                <FormLabel>Email or username</FormLabel>
                                <Input type='email' placeholder="Email or username" onChange={check} />
                                <div className={email || username ? "d-block mt-1" : "d-none"}>
                                    <span style={email != '' || username != '' ? { display: 'none' } : { color: '#FF0000', fontSize: 'small' }}>
                                        Missing email or username</span>
                                </div>
                            </FormControl>

                            <FormControl className="px-3 pb-4 px-md-5 pb-md-5">
                                <FormLabel className="mt-4">Password</FormLabel>
                                <InputGroup>
                                    <InputRightElement
                                        onClick={onVisibility}
                                        children={visible === "password" ?
                                            <AiOutlineEye size={26} />
                                            : <AiOutlineEyeInvisible size={26} />}
                                    />
                                    <Input type={visible} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                                </InputGroup>

                                <div className="d-flex justify-content-between mt-3 align-items-center mb-3">
                                    <Text className="fw-bold" color="#CD3B88" fontSize='sm' onClick={() => navigate('/forgotpassword')}>Forgot password?</Text>
                                    {
                                        coba ? <Button colorScheme="pink" variant="solid" onClick={onLogin}>Sign In</Button>
                                            : <Button colorScheme="pink" variant="solid" disabled><Spinner size='sm' /></Button>
                                    }
                                </div>
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default LoginPage;