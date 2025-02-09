import React, { useEffect, useState } from "react";
import stitchImgSad from "../Pictures/sadstitch2.png";

function Nopage(props) {
    const [errorInfo, setErrorInfo] = useState(null);

    useEffect(() => {
        fetch("/api/error404")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch error 404 information");
                }
                return response.json();
            })
            .then(data => {
                setErrorInfo(data);
            })
            .catch(error => {
                console.error("Error fetching error 404 information:", error);
                // Handle error (e.g., show error message to the user)
            });
    }, []);

    return (
        <div className="all">
            <div className="imgcontainer">
                <img src={stitchImgSad} alt="Error 404" className="avatar" />
            </div>
            <h1>{errorInfo ? errorInfo.errorMessage : "Error 404: Page not found"}</h1>
        </div>
    );
}

export default Nopage;
