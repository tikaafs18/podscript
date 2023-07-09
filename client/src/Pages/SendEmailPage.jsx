import React from "react";
import { Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const SendEmailPage = (props) => {

    const global = useSelector((state) => {
        return {
            email: state.userReducer.email
        }
    });

    return <div style={{ background: '#151033', color: 'white', textAlign: 'justify' }}>
        <div className="container p-5">
            <div className="w-75 my-5">
                <Text fontSize='5xl' className="fw-bold pt-5 mt-5">Verify your email</Text>
                <Text fontSize='2xl' className="mt-3 mb-5 pb-5">We've sent an email to <span className="fw-bold">{global.email}</span> to verify your email address and activate your account. Please check your mailbox. The link will be expired in 24 hours.</Text>
                {/* <Text fontSize='2xl' className="pb-5">Click here if you did not receive an email.</Text> */}
            </div>
        </div>
    </div>
}

export default SendEmailPage;