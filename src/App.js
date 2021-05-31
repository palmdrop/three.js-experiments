import { useEffect, useLayoutEffect, useRef } from 'react';

import './App.css';
import T3 from './three/ThreeApp'

function App() {
  const threeMount = useRef(null);

  useEffect(() => {
    T3.initialize();
    threeMount.current.appendChild( T3.getDomElement() );
    T3.start();

    return () => {
      T3.stop();
    };
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      T3.setSize( window.innerWidth, window.innerHeight );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div 
      className="App"
    >
      <div 
        key={"three"}
        ref={threeMount}>
      </div>
    </div>
  );
}

export default App;
