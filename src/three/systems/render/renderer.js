import * as THREE from 'three';

const createRenderer = (canvas) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    // enable the physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };