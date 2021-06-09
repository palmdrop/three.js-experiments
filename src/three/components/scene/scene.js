import * as THREE from 'three';

import { GLOBALS } from '../../world/World'

const createScene = (backgroundColor) => {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(
        backgroundColor, // Color
        3,               // Near
        GLOBALS.far      // Far
    );

    return scene;
};

export {
    createScene
};