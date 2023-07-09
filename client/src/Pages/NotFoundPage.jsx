import React from "react";
import { Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AiFillFacebook, AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";

const NotFoundPage = () => {

    const navigate = useNavigate();
    const idusers = true;
    const status = "verified";

    return <div style={{ background: "#151033", color: 'white', minHeight:'75vh'}}>
        <div className="container p-5">
            <div className="my-5 p-5">
                <Text fontSize='6xl' className="fw-bold mt-5">404 Not Found</Text>
                <Text fontSize='3xl' className="mb-5">The requested URL was not found on this server.</Text>
            </div>
        </div>
    </div>

    // <div style={{ background: "#151033" }}>
    //     <div className="container py-5">
    //                 <Text fontSize='2xl' className="fw-bold pb-3" style={{textAlign: 'center', color:'white' }} onClick={() => navigate(`http:localhost:3000/homepage`)}>Podscript.</Text>
    //         <div className="card w-100 p-5">
    //             <div>
    //             <Text fontSize='xl' className="fw-bold pt-2" style={{ textAlign: 'center' }}>Verify Your Email Address</Text>
    //             <Text className="py-3">Please confirm that you want to use this as your Podscript account email address. Email is unable to be changed later.</Text>
    //             </div>
    //             <Button colorScheme="pink" variant="solid" className="fw-bold mt-3" onClick={() => navigate(`http:localhost:3000/homepage`)} size='md' >Verify My Email</Button>
    //             <div className='d-flex pt-4 justify-content-center'>
    //                 <AiFillFacebook size={30} color="#D53F8C" />
    //                 <AiFillInstagram size={30} color="#D53F8C" />
    //                 <AiFillTwitterCircle size={30} color="#D53F8C" />
    //             </div>
    //         </div>
    //         <div className='text-center mt-3' style={{color:'white'}}>© 2022 Podscript. All rights reserved.</div>
    //     </div>
    // </div>

    {/* <div style={{ background: "#151033", color: 'white' }}>
<div className="container p-5">
    {
        idusers && status == "unverified" ?
            <div>
                <Text fontSize='3xl' className="fw-bold mt-5">Send Email Page</Text>
                <Text fontSize='3xl' className="fw-bold mt-5">Verification Page</Text>
            </div>
            :
            null
    }

    {
        status == "unverified" ?
            <div>
                <Text fontSize='3xl' className="fw-bold mt-5">Landing page</Text>
                <Text fontSize='3xl' className="fw-bold mt-5">Login</Text>
                <Text fontSize='3xl' className="fw-bold mt-5">Regis</Text>
            </div>
            :
            null
    }

    {
        idusers && status ?
            <div>
                <Text fontSize='3xl' className="fw-bold mt-5">Edit Profile</Text>
                <Text fontSize='3xl' className="fw-bold mt-5">Home Page</Text>
            </div>
            :
            null
    }


</div>
</div> */}
}

export default NotFoundPage;