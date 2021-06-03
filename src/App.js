import { useEffect, useLayoutEffect, useRef } from 'react';

import { useKeyboardInput } from './hooks/KeyboardInputHook'

import './App.css';
import T3 from './three/ThreeApp'

import * as THREE from 'three'

function App() {
  const canvasRef = useRef(null);

  const [, setOnPress, setOnHeld, executeHeldActions, initializeKeyActions] = useKeyboardInput(canvasRef.current);

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
    // Initialize Three App
    T3.initialize(canvasRef.current, false);
    T3.start(() => {
      executeHeldActions();
    });

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

    // Stop Three App
    return () => {
      T3.stop();
    };
  });

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
      <canvas 
        className="canvas"
        key={"canvas"} 
        ref={canvasRef} 
      />
    </div>
  );
}

export default App;
