import React, { useState, CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    return (
        <div style={style}>
            <HashLoader color="#36d7b7" />
            <div>Loading...</div>
        </div>
    )
}

export default Loading