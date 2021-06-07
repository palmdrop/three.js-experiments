import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { useKeyboardInput } from './hooks/KeyboardInputHook'

import ProgressBar from './components/indicators/ProgressBar'

import './App.css';
import T3 from './three/ThreeApp'

import * as THREE from 'three'
import LoadingPage from './pages/loadingPage';

function App() {
  const canvasRef = useRef(null);
  const progressRef = useRef(null);

  const [loaded, setLoaded] = useState(0.0);

  // The progress loading state of the application
  // Specifies how many resources have been loaded
  // as a fraction between 0.0 and 1.0
  //const [progress, setProgress] = useState(0.0);
  const onProgress = (url, loaded, total) => {
    setLoaded(loaded / total);
  };

  const onLoad = () => {
    setLoaded(1.0);
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
      T3.initialize(canvasRef.current, false, onProgress, onLoad);
      initializeKeyActions(shortcuts);

      const rig = T3.cameraRig;

      // Mouse controls
      const mouseDown = (e) => {
        rig.setAnchor(true, new THREE.Vector3(
          e.clientY,
          e.clientX,
          0.0
        ));
      };

      const mouseMove = (e) => {
        rig.anchorRotate(new THREE.Vector3(
          e.clientY,
          e.clientX,
          0.0
        ));
      };

      const mouseUp = (e) => {
        rig.setAnchor(false); 
      };

      window.addEventListener("mousedown", mouseDown);
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
      window.addEventListener("blur", mouseUp);
    }

    T3.start(() => {
      executeHeldActions();
    });

    // Stop Three App
    return () => {
      T3.stop();
    };
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      T3.setSize( canvas.clientWidth, canvas.clientHeight );
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
        ref={progressRef} 
        onLoadCallbackSetup={(callback) => onLoad(callback)}
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
