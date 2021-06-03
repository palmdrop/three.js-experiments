import { useEffect, useRef } from "react";

export const useKeyboardInput = (domElement) => {
  // The states of each key
  // If a key is pressed, the corresponding property will be set to true
  // If a key is not pressed, its corresponding property will either not exist 
  // or be set to false
  const keyStates = useRef({}); 

  // The actions that are executed when a key is pressed (one-time action)
  const pressedActions = useRef({});

  // Actions executed when a key is held (each time executeHeldActions is run)
  const heldActions = useRef({});

  // Updates the key states
  const onKeyAction = (e) => {
    const key = e.code; // The current key name/value
    const state = e.type === "keydown"; // True if pressed, false if not

    // If the key is pressed but wasn't previously, execute the corresponding
    // press action
    if(state && !isHeld(key)) {
      if(pressedActions.current[key]) {
        e.preventDefault();
        pressedActions.current[key](e, keyStates); // Execute action
      }
    }

    // Update the key states
    keyStates.current[key] = {
      isPressed: state,
      event: e
    };
  };

  // Disable all key presses if focus is lost
  const reset = (e) => {
    keyStates.current = {};
  };

  // Returns true if a key is held
  const isHeld = (key) => {
    if(!keyStates.current[key]) {
      return false;
    }
    return keyStates.current[key].isPressed | false;
  }

  // Helper function for linking an action to a specific key press/hold
  // Multiple keys can be linked at the same time, if an array with key names is passed
  const setActions = (keys, action, object) => {
    if(Array.isArray(keys)) {
      for(const key of keys) {
        setActions(key, action, object);
      }
      return;
    } 
    object[keys] = action;
  }

  // Links an action to a key press
  const setOnPress = (keys, action) => {
    setActions(keys, action, pressedActions.current);
  };

  // Links an action to a key hold
  const setOnHeld = (keys, action) => {
    setActions(keys, action, heldActions.current);
  };

  // Executes all actions associated with currently held keys
  const executeHeldActions = () => {
    Object.entries(heldActions.current).forEach(([key, action]) => {
      const keyData = keyStates.current[key];
      if(isHeld(key)) action(keyData ? keyData.event : null);
    });
  };

  // Initialize with actions for pressed and held keys
  const initialize = (keyInfos) => {
    keyInfos.forEach((keyInfo) => {
      if(!keyInfo.onHeld) {
        setOnPress(keyInfo.keys, keyInfo.action);
      } else {
        setOnHeld(keyInfo.keys, keyInfo.action);
      }
    });
  }

  useEffect(() => {
    // Add handler to both keydown and keyup events, since it can handle both
    window.addEventListener("keydown", onKeyAction);
    window.addEventListener("keyup", onKeyAction);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("keydown", onKeyAction);
      window.removeEventListener("keyup", onKeyAction);
      window.removeEventListener("blur", reset);
    };
  });

  return [isHeld, setOnPress, setOnHeld, executeHeldActions, initialize];
};
