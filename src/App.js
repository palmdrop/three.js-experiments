import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { useKeyboardInput } from './hooks/KeyboardInputHook'

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

  const onLoad = () => {
    //setLoaded(1.0);
    T3.start();
  };

  const [, , , executeHeldActions, initializeKeyActions] = useKeyboardInput(canvasRef.current);

  const shortcuts = [
    {
      keys: 'KeyW',
      action: (e) => {
        if(e.getModifierState("Shift")) {
          T3.look('up');
        } else {
          T3.move('up');
        }
      },
      onHeld: true
    },
    
    {
      keys: 'KeyA',
      action: (e) => {
        if(e.getModifierState("Shift")) {
          T3.look('left');
        } else {
          T3.move('left');
        }
      },
      onHeld: true
    },
    {
      keys: 'KeyS',
      action: (e) => {
        if(e.getModifierState("Shift")) {
          T3.look('down');
        } else {
          T3.move('down');
        }
      },
      onHeld: true
    },
    {
      keys: 'KeyD',
      action: (e) => {
        if(e.getModifierState("Shift")) {
          T3.look('right');
        } else {
          T3.move('right');
        }
      },
      onHeld: true
    }
  ];

  useEffect(() => {
    if(!T3.initialized) {
      // Initialize Three App
      T3.initialize(canvasRef.current, onProgress, onLoad);
      //initializeKeyActions(shortcuts);
    }

    /*T3.start(() => {
      //executeHeldActions();
    });*/

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
