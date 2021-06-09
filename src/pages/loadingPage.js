import React, { useState, useRef, useEffect } from 'react'

import ProgressBar from '../components/indicators/ProgressBar'

import './loadingPage.css'

const LoadingPage = ({ loaded }) => {
    const backgroundURL = useRef(null);
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
    
    // Create background
    const getBackground = () => {
        if(backgroundURL.current) return backgroundURL.current;

        const text = "THREE";
        const canvas = document.createElement("canvas");
        const fontSize = 100;
        canvas.setAttribute("height", fontSize);
        var context = canvas.getContext('2d');
        context.font = fontSize + 'px sans-serif';
        const textMetrics = context.measureText(text);

        canvas.setAttribute("width", textMetrics.width);

        context.font = fontSize + 'px cursive';
        context.fillStyle = "white";
        context.fillText(text, 0, fontSize);

        backgroundURL.current = canvas.toDataURL("image/png");
        return backgroundURL.current;
    }

    return (
        // If not done, display loading screen
        !done ? 

        <div 
            className={getClasses("loading-page")}
            style={{backgroundImage: `url(${getBackground()})`}}
            
        >
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
