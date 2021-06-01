import * as THREE from 'three';

import { PhysicsCamera } from './camera/PhysicsCamera'

class ThreeApp {
    initialize(canvas, useDevicePixelRatio) {
        this.useDevicePixelRatio = useDevicePixelRatio && window.devicePixelRatio;

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

        // SCENE
        this.scene    = new THREE.Scene();

        // Create cube
        const geometry = this.generateGeometry();
        //new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhongMaterial( { color: 0x258f70 } );
        this.cube = new THREE.Mesh( geometry, material );

        // Create light
        const light = new THREE.DirectionalLight(
            0xFFFFFF, // Color
            1         // Intensity
        );
        light.position.set(-3, 2, 4);

        const ambientLight = new THREE.AmbientLight( 0x202020 );

        // And add to scene
        this.scene.add( this.cube );
        this.scene.add( light );
        this.scene.add( ambientLight );


        // Resize scene to correct size
        this.initialized = true;
        this.setSize( canvas.clientWidth, canvas.clientHeight );
    }

    generateGeometry() {
        const klein = (v, u, target) => {
            u *= Math.PI;
            v *= 2 * Math.PI;
            u = u * 2;
          
            let x;
            let z;
          
            if (u < Math.PI) {
                x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
                z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
            } else {
                x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
                z = -6 * Math.sin(u);
            }
          
            const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
          
            target.set(x, y, z).multiplyScalar(0.75);
        }
        /*return new THREE.ParametricGeometry(
            klein, 107, 25
        );*/
        /*return new THREE.TorusKnotGeometry(
            4.1, 11, 75, 15, 17
        );*/
        //return new THREE.ConeGeometry(6, 8, 16);
        return new THREE.BoxGeometry(3, 3, 3, 4, 4, 4);
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
        const right = this.camera.getWorldDirection().clone().cross(this.camera.up);
        right.normalize();

        switch(direction)
        {
            case 'up': 
                //this.camera.addForce(this.camera.up.clone().multiplyScalar(1.2));
                this.camera.addForce(this.camera.getWorldDirection());
            break;
            case 'left': 
                this.camera.addForce(right.multiplyScalar(-1));
            break;
            case 'down': 
                this.camera.addForce(this.camera.getWorldDirection().clone().multiplyScalar(-1));
                //this.camera.addForce(this.camera.up.clone().multiplyScalar(-1));
            break;
            case 'right': 
                this.camera.addForce(right.multiplyScalar(1));

            break;
        }

    }

    // Returns the dom element of the renderer
    // Used to mount canvas to DOM
    getDomElement() {
        return this.renderer.domElement;
    }
};

const T3 = new ThreeApp();
export default T3;