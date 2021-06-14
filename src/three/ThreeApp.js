import * as THREE from 'three';

import { World } from './world/World'
import { AnimationLoop } from './systems/loop/AnimationLoop'
import { KeyInputHandler } from './systems/input/KeyInputHandler'
import { ASSETHANDLER } from './systems/assets/AssetHandler';
//import { AssetHandler } from './systems/assets/AssetHandler'

let world;

class ThreeApp {
    constructor() {
        // True when the application has been fully initialized
        this.initialized = false;

        // Event listeners
        // Mainly used to handle mouse input
        this.listeners = [];

        // Time and animation
        this.loop = new AnimationLoop(
            false // Do not calculate frame rate
        );

        // Keyboard shortcuts
        const move = (direction) => {
            world.cameraRig.move(direction);
        };
        const look = (direction) => {
            world.cameraRig.look(direction);
        };
        this.shortcuts = [
            {
                keys: 'KeyW',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        look('up');
                    } else {
                        move('up');
                    }
                },
                onHeld: true
            },

            {
                keys: 'KeyA',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        look('left');
                    } else {
                        move('left');
                    }
                },
                onHeld: true
            },
            {
                keys: 'KeyS',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        look('down');
                    } else {
                        move('down');
                    }
                },
                onHeld: true
            },
            {
                keys: 'KeyD',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        look('right');
                    } else {
                        move('right');
                    }
                },
                onHeld: true
            }
        ];
    }

    async initialize(canvas, onProgress, onLoad) {
        //this.assetHandler = new AssetHandler();
        // Load resources, then initialize world, listeners, etc
        world = new World(canvas);
        world.initialize();
        ASSETHANDLER.onLoad(onProgress, () => {
            // Initialize world
            this.canvas = world.canvas; // If no canvas is supplied, the world will create one

            // Mouse controls
            const rig = world.cameraRig;
            const mouseDown = (e) => rig.setAnchor(true, new THREE.Vector3(e.clientY, e.clientX, 0.0));
            const mouseMove = (e) => rig.anchorRotate(new THREE.Vector3(e.clientY, e.clientX, 0.0));
            const mouseUp   = (e) => rig.setAnchor(false); 
            const scroll    = (e) => rig.zoom(Math.sign(e.deltaY) === 1 ? "out" : "in");
            const addListener = (listener, callback) => this.listeners.push({listener, callback});

            // Add listeners
            addListener("mousedown", mouseDown);
            addListener("mousemove", mouseMove);
            addListener("mouseup", mouseUp);
            addListener("blur", mouseUp);
            addListener("wheel", scroll);

            // Initialize keyboard input
            this.keyInputHandler = new KeyInputHandler(window, this.shortcuts);

            // Set initailized and call onLoad callback
            this.initialized = true;
            onLoad && onLoad();
        });
    }


    start(callback) {
        // Register listeners
        this.listeners.forEach(({listener, callback}) => {
            this.canvas.addEventListener(listener, callback);
        });

        // Enable keyboard input
        this.keyInputHandler.enable();

        // Start animation loop
        this.loop.start((delta, now) => {
            if(!this.initialized) return;

            // Execute actions linked to keyboard input
            this.keyInputHandler.executeHeldActions();

            // Render the scene
            world.update(delta, now);
            world.render(delta);

            // Callback 
            callback && callback(delta);
        });
    }

    stop() {
        // Remove listeners
        this.listeners.forEach(({listener, callback}) => {
            this.canvas.removeEventListener(listener, callback);
        });

        // Stop animaton loop
        this.loop.stop();
    }

    resize() {
        if(!this.initialized) return;
        world.resize();
    }

    // Returns the dom element of the renderer
    // Used to mount canvas to DOM
    getDomElement() {
        return world.renderer.domElement;
    }
};

const T3 = new ThreeApp();
export default T3;