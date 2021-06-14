import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

import t1 from '../../../assets/textures/concrete1.png';
import { ASSETHANDLER } from '../../systems/assets/AssetHandler';

const createScreen = (renderer, scene, camera) => {
    // Plane dimensions
    const planeWidth = 6;
    const planeHeight = 3;

    // Setup render 
    const resolution = 200;
    const rtWidth = planeWidth * resolution;
    const rtHeight = planeHeight * resolution;

    // TODO use normal render targets if webgl2 is not supported
    var renderTarget = new THREE.WebGLMultisampleRenderTarget(rtWidth, rtHeight);

    // Setup post processing pass
    const composer = new EffectComposer(renderer, renderTarget);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    /*composer.addPass(new BloomPass(
        1,
        25,
        1,
        256
    ));*/
    composer.addPass(new FilmPass(
        0.5,  // Noise intensity
        0.1,  // Scan line intensity
        100,   // Scan line count
        0     // Grayscale
    ));
    composer.setSize(rtWidth, rtHeight);
    composer.renderToScreen = false;


    // Setup geometry/material/mesh
    const geometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
    const material = new THREE.MeshStandardMaterial( {
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.5,

        map: renderTarget.texture,
        emissiveMap: renderTarget.texture,

        bumpMap: ASSETHANDLER.loadTexture(t1),
        bumpScale: 0.03
    });

    // Helper function for rendering to the virtual screen
    const renderToScreen = (delta) => {
        // Set the map and the emissive map (to give screen a "glow")

        // Make sure the camera aspect ratio is correct
        // This will be reset to the old value after render
        const oldAspect = camera.aspect;
        camera.aspect = rtWidth / rtHeight;
        camera.updateProjectionMatrix();
        
        // Set the render target
        //renderer.setRenderTarget(renderTarget);

        // And render the screen
        //renderer.render( scene, camera );
        composer.render(delta);
        composer.swapBuffers();

        // Reset camera aspect
        camera.aspect = oldAspect;
        camera.updateProjectionMatrix();
    };

    const screen = new (class Screen extends THREE.Object3D {
        constructor() {
            super();
            const mesh = new THREE.Mesh( geometry, material );
            this.add( mesh );

        }

        update(delta, time) {
        }

    })();

    return {renderToScreen, screen};
};

export { createScreen };