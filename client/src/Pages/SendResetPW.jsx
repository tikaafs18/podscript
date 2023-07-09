import React from "react";
import { Text, Input, Button, Icon, useToast, Spinner } from "@chakra-ui/react";
import { RiErrorWarningLine } from "react-icons/ri";
import { API_URL } from "../helper";
import Axios from "axios";

const SendResetPasswordPage = (props) => {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [coba, setCoba] = React.useState(true);

    const check = (e) => {
        let decide = e.target.value;

        if (decide.includes('@' && '.com')) {
            // console.log('Ini email', decide);
            setEmail(decide);
            setUsername('');
        } else if (!decide.includes('@' && '.com')) {
            if (!decide.includes('@') && '.co') {
                // console.log('Ini username', decide);
                setUsername(decide);
                setEmail('');
            }
        }
    }

    const toast = useToast();

    const sendLink = () => {
        setCoba(!coba);
        setTimeout(() => {
            Axios.patch(API_URL + `/auth/forgotpassword/users?${email ? `email=${email}` : `username=${username}`}`)
                .then((res) => {
                    if (res.data.success) {
                        localStorage.setItem('emailLog', email);
                        setCoba(coba);
                        toast({
                            title: 'Reset password email has been sent',
                            description: 'Please check your mailbox',
                            status: 'success',
                            duration: '3000',
                            isClosable: true
                        })
                    } else {
                        setCoba(coba);
                        toast({
                            title: 'User not found',
                            description: 'Please check again',
                            status: 'error',
                            duration: '3000',
                            isClosable: true
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }, 3000)
    }

    return <div className="container">
        <div className="card w-50 m-auto my-5 p-5">
            <div className="card-body mt-3">
                <Text fontSize='2xl' className='card-title fw-bold pb-3 border-bottom border-lg-secondary' style={{ textAlign: 'center' }}>Podscript.</Text>
                <div className="d-flex text-align-center justify-content-center mt-3">
                    <Icon as={RiErrorWarningLine} w={8} h={8} />
                    <Text fontSize='xl' className='card-title fw-bold ms-2'>Trouble Logging In?</Text>
                </div>
                <Text fontSize='md' className='card-text fw-muted my-4'>Enter your email or username and we'll send you a link to get back into your account.</Text>
                <Input className="mb-3" placeholder="Email or Username" onChange={check} />
            </div>

            {
                coba ? <Button className="mx-3 mb-5" size='sm' colorScheme="pink" variant="solid" onClick={sendLink}>Send Reset Password Link</Button>
                    : <Button className="mx-3 mb-5" size='sm' colorScheme="pink" variant="solid" disabled><Spinner size='sm' /></Button>
            }

            {/* <Button className="mx-3 mb-5" size='md' colorScheme="pink" onClick={sendLink}>Send Reset Password Link</Button> */}
        </div>
    </div>
}

export default SendResetPasswordPage;