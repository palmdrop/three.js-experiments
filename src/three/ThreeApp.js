import * as THREE from 'three';

class ThreeApp {
    constructor() {
    }

    initialize() {
        // RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // CAMERA
        this.camera   = new THREE.PerspectiveCamera( 
            75,                                   // fov
            window.innerWidth/window.innerHeight, // Aspect ratio
            0.1,                                  // near
            1000                                  // far
        );
        this.camera.position.z = 5;

        // SCENE
        this.scene    = new THREE.Scene();

        // Create cube
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x258f70 } );
        this.cube = new THREE.Mesh( geometry, material );

        // And add to scene
        this.scene.add( this.cube );

        this.initialized = true;
    }

    start() {
        // Animation callback
        const animate = () => { 
            // Recursively request another frame
            this.frameID = requestAnimationFrame( animate );

            // Rotate the cube
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;

            // Render the scene
            this.renderer.render( this.scene, this.camera );
        };

        // Start animation
        animate();
    }

    stop() {
        // Stop animation
        cancelAnimationFrame(this.frameID);
    }

    setSize(width, height) {
        if(!this.initialized) return;
        
        // Update canvas size
        this.renderer.setSize( width, height );

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    // Returns the dom element of the renderer
    // Used to mount canvas to DOM
    getDomElement() {
        return this.renderer.domElement;
    }
};

const T3 = new ThreeApp();
export default T3;