import * as THREE from 'three';

import { GLOBALS } from '../../world/World'

const createRenderer = (canvas) => {
    // CREATE RENDERER
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        powerPreference: "high-performance",
        //preserveDrawingBuffer: true
    });
    //renderer.autoClear = false;

    // SHADOWS
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // COLOR AND LIGHTING
    if(GLOBALS.useSRGB) renderer.outputEncoding = THREE.sRGBEncoding;

    // enable the physically correct lighting model
    renderer.physicallyCorrectLights = true;


    return renderer;
}

export { createRenderer };