import * as THREE from 'three';

import { PhysicsCamera } from './camera/PhysicsCamera'
import { CameraRig } from './camera/CameraRig'

import t1 from '../resources/warp7.png'

class ThreeApp {
    initialize(canvas, useDevicePixelRatio) {
        this.useDevicePixelRatio = useDevicePixelRatio && window.devicePixelRatio;

        this.textureLoader = new THREE.TextureLoader();

        // RENDERER
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: canvas,
                antialias: true
            }
        );
        //this.renderer.setSize( window.innerWidth, window.innerHeight, false );
        this.renderer.setSize(0, 0, false);

        // CAMERA
        this.camera   
            = new PhysicsCamera(
        //= new THREE.PerspectiveCamera( 
            75,                                   // fov
            window.innerWidth/window.innerHeight, // Aspect ratio
            0.1,                                  // near
            1000                                  // far
        );
        this.camera.position.z = 10;
        this.camera.lookAt(new THREE.Vector3());

        this.cameraRig = new CameraRig(this.camera);

        // FOG
        const backgroundColor = 0x054443;
        const fog = new THREE.Fog(
            backgroundColor, // Color
            3, // Near
            40 // Far
        );

        const texture1 = this.textureLoader.load(t1);
        texture1.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        //texture1.minFilter = THREE.LinearFilter;
        //texture1.magFilter = THREE.LinearMipMapLinearFilter;

        // MODELS
        const knotGeometry = new THREE.TorusKnotGeometry( 1, 0.2, 100, 16 );
        const knotMaterial = new THREE.MeshStandardMaterial( { 
            color: 0x3F3438,
            metalness: 0.8,
            roughness: 0.7,
            bumpMap: texture1,
            bumpScale: 0.1
        } );
        this.torusKnot = new THREE.Mesh( knotGeometry, knotMaterial );

        // SCENE
        this.scene    = new THREE.Scene();

        // Create cube
        const cubeSize = 9;
        const detail = 200;
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, detail, detail, detail);

        const material = 
        //new THREE.MeshPhongMaterial( { 
        new THREE.MeshStandardMaterial({
            color: 0x258f70, 
            map: texture1,
            bumpMap: texture1,
            bumpScale: 1.0,
            displacementMap: texture1,
            displacementScale: 0.5,
            side: THREE.BackSide,
            metalness: 0.8,
            roughness: 0.9,
        });
        material.dithering = true;

        this.cube = new THREE.Mesh( geometry, material );

        // Create light
        const light1 = new THREE.PointLight(
            0xFF6F8F, // Color
            10,        // Intensity
            35,       // Distance
            2         // Decay
        );
        light1.position.set(4, 4, 3);

        const light2 = new THREE.PointLight(
            0xFF6F8F, // Color
            12,        // Intensity
            30,       // Distance
            2         // Decay
        );
        light2.position.set(-2, -3, -3);

        const ambientLight = new THREE.AmbientLight( 0x202020 );

        // And add to scene
        this.scene.add( this.cube );
        this.scene.add( light1 );
        this.scene.add( light2 );
        this.scene.add( ambientLight );
        //this.scene.add( this.torusKnot );
        this.scene.fog = fog;
        this.scene.background = new THREE.Color(backgroundColor);


        // Resize scene to correct size
        this.initialized = true;
        this.setSize( canvas.clientWidth, canvas.clientHeight );
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