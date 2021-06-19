import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import tvTexture from '../../../assets/textures/tv.jpg';
import { ASSETHANDLER } from '../../systems/assets/AssetHandler';

import { BadTVShader } from '../../../external/three/shaders/BadTVShader.js'
import { TVShader } from '../../shaders/TV/TVShader.js';
import { CopyShader } from '../../../external/three/shaders/CopyShader.js'
import { GLOBALS } from '../../world/World';

const createOverlay = (width, height, time, fps) => {
    const ctx = document.createElement('canvas').getContext('2d');

    const proportions = height / width;

    const cornerOffset = width / 30;
    const lineLength = width / 6;
    const lineWidth = width / 500;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.font = '50px serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("TWISTING HALLWAY", cornerOffset + 20, cornerOffset + 70);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = lineWidth

    //ctx.beginPath();
    for(var x = 0; x <= 1; x++) for(var y = 0; y <= 1; y++) {
        const cx = cornerOffset + x * (width - 2 * cornerOffset);
        const cy = cornerOffset + y * (height - 2 * cornerOffset);
        for(var l = 0; l <= 1; l++) {
            ctx.moveTo(cx, cy);
            if(l == 0) {
                ctx.lineTo(
                    cx + (x == 0 ? lineLength : -lineLength),
                    cy
                );
            } else {
                ctx.lineTo(
                    cx,
                    cy + (y == 0 ? lineLength : -lineLength) * proportions,
                );
            }
            ctx.stroke();
        }
    }

    ctx.fill();

    const texture = new THREE.CanvasTexture(ctx.canvas);

    return [ctx, texture];
};

const createScreenMesh = (planeWidth, planeHeight, renderTarget, fps) => {
    // Setup geometry/material/mesh
    const geometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);
    const material = new THREE.MeshStandardMaterial({
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.70,
        metalness: 0.0,
        roughness: 0.1,

        map: renderTarget.texture,
        emissiveMap: renderTarget.texture,

        bumpMap: ASSETHANDLER.loadTexture(tvTexture),
        bumpScale: 0.0005
    });

    const screen = new (class Screen extends THREE.Object3D {
        constructor() {
            super();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            this.castShadow = true;
            this.add(mesh);

            this.previousTime = 0.0;
        }

        update(delta, time) {
            if (time - this.previousTime > (1 / fps)) {
                this.needsUpdate = true;
                this.previousTime = time;
            }
        }

    })();

    return screen;
};

const createScreen = (renderer, scene, camera, passUniforms) => {
    // Plane dimensions
    const planeWidth = GLOBALS.roomDimensions.width / 1.2;
    const planeHeight = planeWidth / 1.3;

    // Setup render 
    const resolution = 200;
    const rtWidth = planeWidth * resolution;
    const rtHeight = planeHeight * resolution;

    // Screen update frequency
    const fps = 30;

    // Setup overlay texture
    const [ctx, overlayTexture] = createOverlay(rtWidth, rtHeight, 0.0, fps);

    // TODO use normal render targets if webgl2 is not supported
    var renderTarget = new THREE.WebGLMultisampleRenderTarget(rtWidth, rtHeight);

    // Setup post processing pass
    const composer = new EffectComposer(renderer, renderTarget);

    // Render passes
    const renderPass = new RenderPass(scene, camera);
    /*composer.addPass(new UnrealBloomPass(
        new THREE.Vector2( rtWidth, rtHeight ), // Resolution
        1.02, // Strength
        1,   // Radius
        0.99, // Threshold
    ));*/
    const filmPass = new FilmPass(
        0.1,  // Noise intensity
        0.2,  // Scan line intensity
        100,   // Scan line count
        0     // Grayscale
    );

    /*const badTVShaderPass = new ShaderPass( BadTVShader );
    badTVShaderPass.uniforms["distortion"].value = 1.1;
    badTVShaderPass.uniforms["distortion2"].value = 1.1;
    badTVShaderPass.uniforms["speed"].value = 0.1;
    badTVShaderPass.uniforms["rollSpeed"].value = 0.0;
    */

    const tvShaderPass = new ShaderPass(TVShader);
    tvShaderPass.uniforms["redOffset"].value = [0.0004, -0.001];
    tvShaderPass.uniforms["greenOffset"].value = [-0.001, 0];
    tvShaderPass.uniforms["blueOffset"].value = [0.001, 0.001];
    tvShaderPass.uniforms["warpOffset"].value = [0.8, 0.8];
    tvShaderPass.uniforms["overlayTexture"].value = overlayTexture;

    tvShaderPass.uniforms["contrast"].value = 1.1;
    tvShaderPass.uniforms["brightness"].value = 0.8;

    // Add passes
    composer.addPass(renderPass);
    composer.addPass(filmPass);
    //composer.addPass( badTVShaderPass );
    composer.addPass(tvShaderPass);
    // Required to avoid problems when using multiple effect passes
    // and rendering to a render texture  
    composer.addPass(new ShaderPass(CopyShader));

    // Set uniforms (if passed)
    if(passUniforms) {
        const passes = { renderPass, filmPass, tvShaderPass };
        for ( const passName in passes ) {
            const uniforms = passUniforms[passName];
            if(!uniforms) continue;
            const pass = passes[passName];
            for ( const uniformName in uniforms ) {
                const uniformObject = pass.uniforms[uniformName];
                if(!uniformObject) continue;
                const uniformValue = uniforms[uniformName];
                uniformObject.value = uniformValue;
            }
        }
    }

    composer.setSize(rtWidth, rtHeight);

    // Do not render to screen, render to render buffer
    composer.renderToScreen = false;

    // Create screen mesh
    const screen = createScreenMesh(planeWidth, planeHeight, renderTarget, fps);

    // Helper function for rendering to the virtual screen
    const renderToScreen = (delta, time) => {
        if (!screen.needsUpdate) return;
        screen.needsUpdate = false;

        /*ctx.fillStyle = '#fff0';
        ctx.clearRect(0, 0, rtWidth, rtHeight);
        ctx.fillStyle = '#fff';
        ctx.fillText(time.toFixed(2), 50, 90);
        tvShaderPass.uniforms["overlayTexture"].value.needsUpdate = true;
        */
        
        tvShaderPass.uniforms["time"].value = time;
        //badTVShaderPass.uniforms["time"].value = time;

        // Make sure the camera aspect ratio is correct
        // This will be reset to the old value after render
        const oldAspect = camera.aspect;
        camera.aspect = rtWidth / rtHeight;
        camera.updateProjectionMatrix();

        // And render to render texture
        composer.render(delta);

        // Reset camera aspect
        camera.aspect = oldAspect;
        camera.updateProjectionMatrix();
    };



    return { renderToScreen, screen, passes: {

    } };
};

export { createScreen };