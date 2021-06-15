import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import t1 from '../../../assets/textures/tv.jpg';
import { ASSETHANDLER } from '../../systems/assets/AssetHandler';

import { BadTVShader } from '../../../external/three/shaders/BadTVShader.js'
import { RGBSplitShader } from '../../shaders/rgb-split/RGBSplitShader.js';
import { CopyShader } from '../../../external/three/shaders/CopyShader.js'

const createScreen = (renderer, scene, camera) => {
    // Plane dimensions
    const planeWidth = 6;
    const planeHeight = 3;

    // Setup render 
    const resolution = 300;
    const rtWidth = planeWidth * resolution;
    const rtHeight = planeHeight * resolution;

    // Screen update frequency
    const fps = 30;

    // TODO use normal render targets if webgl2 is not supported
    var renderTarget = new THREE.WebGLMultisampleRenderTarget(rtWidth, rtHeight);

    // Setup post processing pass
    const composer = new EffectComposer(renderer, renderTarget);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(new UnrealBloomPass(
        new THREE.Vector2( rtWidth, rtHeight ),
        1.5,
        0,
        0.99,
    ));
    composer.addPass(new FilmPass(
        0.2,  // Noise intensity
        0.2,  // Scan line intensity
        100,   // Scan line count
        0     // Grayscale
    ));
    BadTVShader.uniforms["distortion"].value = 10.1;
    BadTVShader.uniforms["distortion2"].value = 10.1;
    BadTVShader.uniforms["speed"].value = 0.1;
    BadTVShader.uniforms["rollSpeed"].value = 1.0;
    //composer.addPass( new ShaderPass( BadTVShader ));

    RGBSplitShader.uniforms["redOffset"].value = [0.001, -0.002];
    RGBSplitShader.uniforms["greenOffset"].value = [-0.003, 0];
    RGBSplitShader.uniforms["blueOffset"].value = [0.002, 0.003];

    RGBSplitShader.uniforms["warpOffset"].value = [0.1, 0.1];

    composer.addPass(new ShaderPass(RGBSplitShader));

    composer.addPass(new ShaderPass(CopyShader));

    composer.setSize(rtWidth, rtHeight);
    composer.renderToScreen = false;

    // Setup geometry/material/mesh
    const geometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
    const material = new THREE.MeshStandardMaterial({
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.4,
        metalness: 0.5,
        roughness: 0.5,

        map: renderTarget.texture,
        emissiveMap: renderTarget.texture,
        //map: composer.readBuffer.texture,
        //emissiveMap: composer.readBuffer.texture,

        bumpMap: ASSETHANDLER.loadTexture(t1),
        bumpScale: 0.0001
    });

    // Helper function for rendering to the virtual screen
    var needsUpdate = true;
    const renderToScreen = (delta) => {
        if (!needsUpdate) return;
        needsUpdate = false;

        // Set the map and the emissive map (to give screen a "glow")

        // Make sure the camera aspect ratio is correct
        // This will be reset to the old value after render
        const oldAspect = camera.aspect;
        camera.aspect = rtWidth / rtHeight;
        camera.updateProjectionMatrix();

        // Set the render target
        //renderer.setRenderTarget(renderTarget);

        // And render the screen
        composer.render(delta);
        //composer.swapBuffers();

        // Reset camera aspect
        camera.aspect = oldAspect;
        camera.updateProjectionMatrix();
    };

    const screen = new (class Screen extends THREE.Object3D {
        constructor() {
            super();
            const mesh = new THREE.Mesh(geometry, material);
            this.add(mesh);

            this.previousTime = 0.0;
        }

        update(delta, time) {
            if (time - this.previousTime > (1 / fps)) {
                needsUpdate = true;
                this.previousTime = time;
            }
        }

    })();

    return { renderToScreen, screen };
};

export { createScreen };