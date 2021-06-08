import * as THREE from 'three';

import { World } from './world/World'
import { createRenderer } from './systems/render/renderer'
import { createScene } from './components/scene/scene'
import { createCamera } from './components/camera/camera'
import { createTorusKnot } from './components/models/torusKnot';
import { createRoom } from './components/models/room';
import { createLights } from './components/light/createLights';
import { Resizer } from './systems/resize/Resizer';

import t1 from '../assets/images/warp3.png'

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
        this.initialized = false;
    }

    initialize(canvas, onProgress, onLoad) {
        this.resources = new ResourceManager();
        this.resources.load(onProgress, () => {

            world = new World(canvas, this.resources);

            this.setup();
            onLoad && onLoad();

            this.initialized = true;
        });
    }

    setup() {
        const rig = world.cameraRig;
        const canvas = world.canvas;

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

        canvas.addEventListener("mousedown", mouseDown);
        canvas.addEventListener("mousemove", mouseMove);
        canvas.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("blur", mouseUp);
    }

    start(callback) {
        // Animation callback
        let then = 0;
        const animate = (now) => { 
            now *= 0.001;
            const delta = now - then;
            then = now;

            // Recursively request another frame
            this.frameID = requestAnimationFrame( animate );

            if(!this.initialized) return;

            // Render the scene
            world.update(delta);
            world.render();

            // Callback 
            callback && callback(delta);

            // Update camera
            world.camera.update(delta);
        };

        // Start animation
        requestAnimationFrame(animate);
    }

    stop() {
        // Stop animation
        cancelAnimationFrame(this.frameID);
    }

    resize() {
        if(!this.initialized) return;
        world.resize();
    }

    move(direction) {
        const forward = world.camera.getForward();
        const right = world.camera.getWorldDirection(new THREE.Vector3()).clone().cross(world.camera.up);
        right.normalize();

        switch(direction)
        {
            case 'up': 
                world.camera.addForce(forward);
            break;
            case 'left': 
                world.camera.addForce(right.multiplyScalar(-1));
            break;
            case 'down': 
                world.camera.addForce(forward.clone().multiplyScalar(-1));
            break;
            case 'right': 
                world.camera.addForce(right.multiplyScalar(1));
            break;
        }
    }

    look(direction) {
        const right = world.camera.getWorldDirection(new THREE.Vector3()).clone().cross(world.camera.up);
        right.normalize();
        const speed = 1.0
        const rotation = new THREE.Vector3();

        switch(direction) 
        {
            case 'up': 
                rotation.x = speed;
            break;
            case 'left': 
                rotation.y = speed;
            break;
            case 'down': 
                rotation.x = -speed;
            break;
            case 'right': 
                rotation.y = -speed;
            break;
        }
        world.camera.addRotation(rotation, true);
    }

    // Returns the dom element of the renderer
    // Used to mount canvas to DOM
    getDomElement() {
        return world.renderer.domElement;
    }
};

const T3 = new ThreeApp();
export default T3;