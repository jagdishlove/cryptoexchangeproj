
import React from 'react';


import { useState } from "react";
import { css } from "@emotion/react";
import BeatLoader from 'react-spinners/BeatLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;


const Loading = () => {
    let [color, setColor] = useState("#ffffff");

    return (
        <div style={{ position: 'relative', marginTop: '20%' }}>
            {/* <BeatLoader color={color} loading={true} css={override} size={150} /> */}
            <BeatLoader color='#89cff0' size={50} />
        </div>
    );
}

export default Loading;