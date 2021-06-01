import { useEffect, useLayoutEffect, useRef } from 'react';

import { useKeyboardInput } from './hooks/KeyboardInputHook'

import './App.css';
import T3 from './three/ThreeApp'

function App() {
  const canvasRef = useRef(null);

  const [, setOnPress, setOnHeld, executeHeldActions] = useKeyboardInput();

  const shortcuts = [
    {
      keys: 'w',
      action: (e) => {
        T3.move('up');
      },
      onHeld: true
    },
    {
      keys: 'a',
      action: (e) => {
        T3.move('left');
      },
      onHeld: true
    },
    {
      keys: 's',
      action: (e) => {
        T3.move('down');
      },
      onHeld: true
    },
    {
      keys: 'd',
      action: (e) => {
        T3.move('right');
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

    // Handle keyboard shortcuts
    shortcuts.forEach((keyInfo) => {
      if(!keyInfo.onHeld) {
        setOnPress(keyInfo.keys, keyInfo.action);
      } else {
        setOnHeld(keyInfo.keys, keyInfo.action);
      }
    });



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
