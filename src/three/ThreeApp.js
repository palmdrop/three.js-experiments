import * as THREE from 'three';

import { World } from './world/World'
import { KeyInputHandler } from './systems/input/KeyInputHandler'

import t1 from '../assets/images/warp1.png'

class ResourceManager {
    constructor() {
        //this.renderer = renderer;
        this.loadManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadManager);
    }

    load(onProgress, onLoad) {
        this._loadResources();
        if(onLoad) this.loadManager.onLoad = onLoad;
        if(onProgress) this.loadManager.onProgress = onProgress;

        return this;
    }

    _loadTexture(path) {
        const texture = this.textureLoader.load(path);
        //texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        return texture;
    }

    _loadResources() {
        this.textures = {
            walls: this._loadTexture(t1),
            test: this._loadTexture(t1)
        };
    }
};



let world;

class ThreeApp {
    constructor() {
        // True when the application has been fully initialized
        this.initialized = false;

        // Event listeners
        // Mainly used to handle mouse input
        this.listeners = [];

        // Keyboard shortcuts
        this.shortcuts = [
            {
                keys: 'KeyW',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        this._look('up');
                    } else {
                        this._move('up');
                    }
                },
                onHeld: true
            },

            {
                keys: 'KeyA',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        this._look('left');
                    } else {
                        this._move('left');
                    }
                },
                onHeld: true
            },
            {
                keys: 'KeyS',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        this._look('down');
                    } else {
                        this._move('down');
                    }
                },
                onHeld: true
            },
            {
                keys: 'KeyD',
                action: (e) => {
                    if(e.getModifierState("Shift")) {
                        this._look('right');
                    } else {
                        this._move('right');
                    }
                },
                onHeld: true
            }
        ];
    }

    initialize(canvas, onProgress, onLoad) {

        this.resources = new ResourceManager();
        this.resources.load(onProgress, () => {

            world = new World(canvas, this.resources);

            this.canvas = world.canvas;

            this.setup();
            onLoad && onLoad();

            this.initialized = true;
        });
    }

    _addListener(listener, callback) {
        this.listeners.push({listener, callback});
    }

    setup() {
        const rig = world.cameraRig;

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

        const scroll = (e) => {
            rig.zoom(Math.sign(e.deltaY) === 1 ? "out" : "in");
        };

        const addListener = (listener, callback) => {
            this.listeners.push({listener, callback});
        }

        addListener("mousedown", mouseDown);
        addListener("mousemove", mouseMove);
        addListener("mouseup", mouseUp);
        addListener("blur", mouseUp);
        addListener("wheel", scroll);

        this.keyInputHandler = new KeyInputHandler(window, this.shortcuts);
    }

    start(callback) {
        // Register listeners
        this.listeners.forEach(({listener, callback}) => {
            this.canvas.addEventListener(listener, callback);
        });

        this.keyInputHandler.enable();

        // Animation callback
        let then = 0;
        const animate = (now) => { 
            now *= 0.001;
            const delta = now - then;
            then = now;

            // Execute actions linked to keyboard input
            this.keyInputHandler.executeHeldActions();

            // Recursively request another frame
            this.frameID = requestAnimationFrame( animate );

            if(!this.initialized) return;

            // Render the scene
            world.update(delta);
            world.render();

            // Callback 
            callback && callback(delta);
        };

        // Start animation
        requestAnimationFrame(animate);
    }

    stop() {
        // Remove listeners
        this.listeners.forEach(({listener, callback}) => {
            this.canvas.removeEventListener(listener, callback);
        });

        this.keyInputHandler.disable();

        // Stop animation
        cancelAnimationFrame(this.frameID);
    }

    resize() {
        if(!this.initialized) return;
        world.resize();
    }

    _move(direction) {
        world.cameraRig.move(direction);
    }

    _look(direction) {
        world.cameraRig.look(direction);
    }

    // Returns the dom element of the renderer
    // Used to mount canvas to DOM
    getDomElement() {
        return world.renderer.domElement;
    }
};

const T3 = new ThreeApp();
export default T3;