import * as THREE from 'three';

import { GLOBALS } from '../../world/World'

const createRenderer = (canvas) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        powerPreference: "high-performance",
    });

    if(GLOBALS.useSRGB) renderer.outputEncoding = THREE.sRGBEncoding;

    // enable the physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };