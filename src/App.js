import { useEffect, useLayoutEffect, useRef } from 'react';

import { useKeyboardInput } from './hooks/KeyboardInputHook'

import './App.css';
import T3 from './three/ThreeApp'

function App() {
  const canvasRef = useRef(null);

  const [, setOnPress, setOnHeld, executeHeldActions] = useKeyboardInput(canvasRef.current);

  const shortcuts = [
    /*
    {
      keys: 'KeyW',
      action: (e) => {
        T3.look('up');
      },
      onHeld: true
    },
    {
      keys: 'A',
      action: (e) => {
        T3.look('left');
      },
      onHeld: true
    },
    {
      keys: 'S',
      action: (e) => {
        T3.look('down');
      },
      onHeld: true
    },
    {
      keys: 'D',
      action: (e) => {
        T3.look('right');
      },
      onHeld: true
    },
    */
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
