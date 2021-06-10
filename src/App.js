import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import './App.css';
import T3 from './three/ThreeApp'
import LoadingPage from './pages/loadingPage';

function App() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(0.0);

  // The progress loading state of the application
  // Specifies how many resources have been loaded
  // as a fraction between 0.0 and 1.0
  const onProgress = (url, loaded, total) => {
    setLoaded(loaded / total);
  };

  useEffect(() => {
    if(!T3.initialized) {
      // Initialize Three App
      T3.initialize(canvasRef.current, onProgress, () => {
        T3.start();
      });
    }

    // Stop Three App
    return () => {
      T3.stop();
    };
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      T3.resize();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div 
      className="App"
    >
      <LoadingPage
        loaded={loaded}
      />
      <canvas 
        className="canvas"
        key={"canvas"} 
        ref={canvasRef} 
      />
    </div>
  );
}

export default App;
