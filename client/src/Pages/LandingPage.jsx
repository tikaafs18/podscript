import React from "react";
import { Text, Button, Image } from "@chakra-ui/react";

const LandingPage = (props) => {
    return <div id='landingpage' style={{ background: "#151033", color: 'white', minHeight:'75vh'}}>
        <div className="container">
            <div className="row p-5 pb-md-5">
                <div className="col-12 m-auto col-md-6 mt-lg-5 pt-lg-5">
                    <Image className="m-auto" src={require('../Assets/tes3.png')}/>
                </div>
                <div className="col-12 col-md-6 mt-lg-5 pt-lg-5">
                    <Text fontSize='4xl' className="fw-bold mt-5 mb-2 pt-5">Moment. Capture. Post.</Text>
                    <Text className="mb-5">Experiencing your relatives life updates without bothering.</Text>
                    {/* <Button colorScheme="pink" className="mb-5">Learn More</Button> */}
                </div>
            </div>
        </div>
    </div>
}

export default LandingPage;