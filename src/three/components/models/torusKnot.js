import * as THREE from 'three';

const createTorusKnot = (texture) => {
    const geometry = new THREE.TorusKnotGeometry( 0.04, 0.4, 200, 100 );
    const material = new THREE.MeshStandardMaterial( { 
        map: texture,
        metalness: 0.3,
        roughness: 0.8,
        bumpMap: texture,
        bumpScale: 0.1
    } );
    const torusKnot = new THREE.Mesh( geometry, material );
    return torusKnot;
};

export { createTorusKnot }