import React, { forwardRef } from 'react'

import './ProgressBar.css'

const ProgressBar = ({ loaded }) => {
    const calculateWidth = (loaded) => {
        return `${100 * loaded}%`;
    };

    return (
        <div className="progress-bar">
            <div 
                className="progress-bar__indicator"
                style={{width: calculateWidth(loaded)}}
            />
        </div>
    )
}

export default ProgressBar