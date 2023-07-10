import React from "react";
import { Text } from "@chakra-ui/react";

const NotFoundPage = () => {
    return <div style={{ background: "#151033", color: 'white', minHeight:'75vh'}}>
        <div className="container p-5">
            <div className="my-5 p-5">
                <Text fontSize='6xl' className="fw-bold mt-5">404 Not Found</Text>
                <Text fontSize='3xl' className="mb-5">The requested URL was not found on this server.</Text>
            </div>
        </div>
    </div>
}

export default NotFoundPage;