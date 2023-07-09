import { Spinner, InputGroup, InputRightElement, Text, Input, FormControl, FormErrorMessage, FormHelperText, FormLabel, Button, useToast, Icon } from "@chakra-ui/react";
import React from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { SearchIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerAction } from "../Actions/userAction";

const RegisterPage = (props) => {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [visible, setVisible] = React.useState('password');
    const [visibleC, setVisibleC] = React.useState('password');
    const [coba, setCoba] = React.useState(true);

    const navigate = useNavigate();
    const toast = useToast();

    const dispatch = useDispatch();

    const onRegister = () => {
        if (email && username && confirmPassword == password) {
            setCoba(!coba);
            setTimeout(() => {
                Axios.post(API_URL + '/auth/register', {
                    email,
                    username,
                    password
                })
                    .then((res) => {
                        if (res.data.success) {
                            toast({
                                title: 'Account Registration Success',
                                description: 'Please check your mailbox for account verification.',
                                status: 'success',
                                duration: 3000,
                                isClosable: true
                            });
                            dispatch(registerAction(res.data));
                            // navigate('/sendemail', { replace: true });
                        } else {
                            setCoba(coba);
                            toast({
                                title: 'Account Registration Failed',
                                description: res.data.message,
                                status: 'error',
                                duration: 3000,
                                isClosable: true
                            });
                        }
                    }).catch((err) => {
                        console.log(`Axios post (register) failed : ${err}`)
                    })
            }, 3000)
        }
    }

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

    let a = 2;

    const symbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    const upperCase = /^(?=.*[A-Z]).*$/;
    const number = /^(?=.*[0-9]).*$/;

    return <div style={{ background: '#151033' }}>
        <div className="container">
            <div className="container p-4">
                <div className="row">
                    <div className="col-12 col-md-6 m-auto">
                        <Text style={{ color: 'white' }} className="fw-bold mb-3" fontSize="4xl">Sign up and share your moments</Text>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="card w-100 mb-5" style={{ color: '#151033' }}>
                            <FormControl className="px-4 pt-4 px-md-5 pt-md-5">
                                <FormLabel>Email</FormLabel>
                                <Input type='email' placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />

                                <div className={email ? "d-block mt-1" : "d-none"}>
                                    <span style={email.includes('@' && '.com') ? { display: 'none' } : { color: '#FF0000', fontSize: 'small' }}>Missing email</span>
                                </div>
                            </FormControl>
                            <FormControl className="px-4 px-md-5">
                                <FormLabel className="mt-4">Username</FormLabel>
                                <Input type='text' placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                                {username.length >= 4 ?
                                    (
                                        <div></div>
                                    ) :
                                    (
                                        <div className={username.length > 0 && username.length <= 4 ? "d-block mt-1" : "d-none"}>
                                            <span style={username.length >= 4 ? null : { color: '#FF0000', fontSize: 'small' }}>Missing username</span>
                                        </div>
                                    )

                                }
                            </FormControl>

                            <FormControl className="px-4 px-md-5">
                                <FormLabel className="mt-4">Password</FormLabel>
                                <InputGroup>
                                    <InputRightElement
                                        onClick={onVisibility}
                                        children={visible === "password" ?
                                            <AiOutlineEye size={26} />
                                            : <AiOutlineEyeInvisible size={26} />}
                                    />
                                    <Input type={visible} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
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

                            <FormControl className="px-4 px-md-5 pb-5">

                                <FormLabel className="mt-4">Confirm Password</FormLabel>
                                <InputGroup>
                                    <InputRightElement
                                        onClick={onVisibilityCPW}
                                        children={visibleC === "password" ?
                                            <AiOutlineEye size={26} />
                                            : <AiOutlineEyeInvisible size={26} />}
                                    />
                                    <Input type={visibleC} placeholder='Confirm your password' onChange={(e) => setConfirmPassword(e.target.value)} />
                                </InputGroup>

                                <div className={confirmPassword ? "d-block mt-1" : "d-none"}>
                                    <span style={confirmPassword == password ? { display: 'none' } : { color: '#FF0000', fontSize: 'small' }}>Missing confirmation password</span>
                                </div>

                                <div className="d-flex justify-content-end mt-3">
                                    {
                                        coba ? <Button colorScheme="pink" variant="solid" onClick={onRegister}>Register</Button>
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

export default RegisterPage;