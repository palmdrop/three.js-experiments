import * as THREE from 'three'

const createRoom = (texture) => {
    const cubeSize = 18;
    const detail = 200;
    const geometry = 
        new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, detail, detail, detail);

    const material = 
        new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.2,
            displacementMap: texture,
            displacementScale: 0.0,
            side: THREE.BackSide,
            metalness: 0.4,
            roughness: 0.6,
        });

    material.dithering = true;

    return new THREE.Mesh( geometry, material );
};

export { createRoom };