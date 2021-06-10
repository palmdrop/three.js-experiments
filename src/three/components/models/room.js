import * as THREE from 'three'

const createRoom = (texture) => {
    const cubeSize = 18;
    const detail = 100;
    const geometry = 
        new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, detail, detail, detail);

    const material = 
        new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.2,
            displacementMap: texture,
            displacementScale: 1.0,
            side: THREE.BackSide,
            metalness: 0.0,
            roughness: 0.2,
        });

    material.dithering = true;

    return new THREE.Mesh( geometry, material );
};

export { createRoom };