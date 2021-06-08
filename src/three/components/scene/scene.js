import * as THREE from 'three';

const createScene = (backgroundColor) => {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(
        backgroundColor, // Color
        3, // Near
        40 // Far
    );

    return scene;
};

export {
    createScene
};