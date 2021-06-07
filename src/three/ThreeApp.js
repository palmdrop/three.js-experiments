import * as THREE from 'three';

import { PhysicsCamera } from './camera/PhysicsCamera'
import { CameraRig } from './camera/CameraRig'

import t1 from '../resources/warp3.png'

class ResourceManager {
    constructor(renderer) {
        this.renderer = renderer;
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
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        return texture;
    }

    _loadResources() {
        this.textures = {
            walls: this._loadTexture(t1),
            test: this._loadTexture(t1)
        };
    }
};

class ThreeApp {
    _setupScene() {

        // FOG
        const backgroundColor = 0x054443;
        const fog = new THREE.Fog(
            backgroundColor, // Color
            3, // Near
            40 // Far
        );

        // MODELS
        const knotGeometry = new THREE.TorusKnotGeometry( 0.04, 0.4, 200, 100 );
        const knotMaterial = new THREE.MeshStandardMaterial( { 
            //color: 0x3F3438,
            map: this.resources.textures.walls,
            metalness: 0.3,
            roughness: 0.8,
            bumpMap: this.resources.textures.walls,
            bumpScale: 0.1
        } );
        this.torusKnot = new THREE.Mesh( knotGeometry, knotMaterial );

        // SCENE
        this.scene    = new THREE.Scene();

        // Create cube
        const cubeSize = 18;
        const detail = 200;
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, detail, detail, detail);

        const material = 
            new THREE.MeshStandardMaterial({
                map: this.resources.textures.walls,
                bumpMap: this.resources.textures.walls,
                bumpScale: 0.2,
                displacementMap: this.resources.textures.walls,
                displacementScale: 0.5,
                side: THREE.BackSide,
                metalness: 0.4,
                roughness: 0.6,
            });

        material.dithering = true;

        this.cube = new THREE.Mesh( geometry, material );

        // Create light
        const light1 = new THREE.PointLight(
            0xFF897F, // Color
            12,        // Intensity
            14,       // Distance
            2         // Decay
        );
        light1.position.set(4, 4, 3);

        const light2 = new THREE.PointLight(
            0x7A886F, // Color
            15,        // Intensity
            14,       // Distance
            2         // Decay
        );
        light2.position.set(-2, -3, -3);

        const light3 = new THREE.PointLight(
            0x8A888F, // Color
            -10,        // Intensity
            7,       // Distance
            2         // Decay
        );
        light3.position.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight( 0x202020 );

        // And add to scene
        this.scene.add( this.cube );
        this.scene.add( light1 );
        this.scene.add( light2 );
        this.scene.add( light3 );
        this.scene.add( ambientLight );
        this.scene.add( this.torusKnot );
        this.scene.fog = fog;
        this.scene.background = new THREE.Color(backgroundColor);


        // Resize scene to correct size
        this.initialized = true;
        this.setSize( this.canvas.clientWidth, this.canvas.clientHeight );
    }


    initialize(canvas, useDevicePixelRatio, onProgress, onLoad) {
        //this.canvas = canvas;
        this.initialized = false;

        // RENDERER
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: canvas,
                antialias: true
            }
        );
        this.canvas = this.renderer.domElement;

        // CAMERA
        this.camera = new PhysicsCamera(
            35,                                   // fov
            window.innerWidth/window.innerHeight, // Aspect ratio
            0.1,                                  // near
            1000                                  // far
        );
        this.camera.position.z = 10;
        this.cameraRig = new CameraRig(this.camera);

        this.useDevicePixelRatio = useDevicePixelRatio && window.devicePixelRatio;
        this.resources = new ResourceManager(this.renderer).load(onProgress, () => {
            this._setupScene()
            onLoad && onLoad();
        });

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

            // Rotate the cube
            //this.cube.rotation.x += 0.01;
            //this.cube.rotation.y += 0.01;
            this.torusKnot.rotation.x += 0 * delta;
            this.torusKnot.rotation.y += 0 * delta;

            // Render the scene
            this.renderer.render( this.scene, this.camera );

            // Callback 
            callback && callback(delta);

            // Update camera
            this.camera.update(delta);
        };

        // Start animation
        requestAnimationFrame(animate);
    }

    stop() {
        // Stop animation
        cancelAnimationFrame(this.frameID);
    }

    setSize(width, height) {
        if(!this.initialized) return;

        // Fetch the current size
        const currentSize = this.renderer.getSize(new THREE.Vector2());

        // And calculate the new size
        const newSize = new THREE.Vector2(width, height);
        // ... possibly using the device pixel ratio
        if(this.useDevicePixelRatio) newSize.multiplyScalar(window.devicePixelRatio);

        // Check if the size has actually been updated
        if(currentSize.equals(newSize)) return;
        
        // Update canvas size
        this.renderer.setSize( newSize.x, newSize.y, false );

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    move(direction) {
        const forward = this.camera.getForward();
        const right = this.camera.getWorldDirection(new THREE.Vector3()).clone().cross(this.camera.up);
        right.normalize();

        switch(direction)
        {
            case 'up': 
                this.camera.addForce(forward);
            break;
            case 'left': 
                this.camera.addForce(right.multiplyScalar(-1));
            break;
            case 'down': 
                this.camera.addForce(forward.clone().multiplyScalar(-1));
            break;
            case 'right': 
                this.camera.addForce(right.multiplyScalar(1));

            break;
        }
    }

    look(direction) {
        const right = this.camera.getWorldDirection(new THREE.Vector3()).clone().cross(this.camera.up);
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
        this.camera.addRotation(rotation, true);
    }

    // Returns the dom element of the renderer
    // Used to mount canvas to DOM
    getDomElement() {
        return this.renderer.domElement;
    }
};

const T3 = new ThreeApp();
export default T3;