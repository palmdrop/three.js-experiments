import React, { useState, useEffect } from 'react'

import ProgressBar from '../components/indicators/ProgressBar'

import './loadingPage.css'

const LoadingPage = ({ loaded }) => {
    const [done, setDone] = useState(false);

    const getClasses = (base) => {
        return base + 
            ((loaded === 1.0) 
            ? (" " + base + "--loaded") 
            : "");
    };

    useEffect(() => {
        // When loaded, set as "done" after a short delay
        // This allows for animating the exit of the page
        if(loaded >= 1.0) {
            setTimeout(() => setDone(true), 1000);
        }
    }, [loaded]);

    return (
        // If not done, display loading screen
        !done ? 

        <div className={getClasses("loading-page")}>
            <div className={getClasses("loading-page__progress-bar-container")}>
                <ProgressBar 
                    loaded={loaded}
                />
            </div>
        </div>

        // And when done, hide loading page
        : null
    )
}

export default LoadingPage
