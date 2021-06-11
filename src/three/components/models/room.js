import * as THREE from 'three'

const createFaceMaterial = (texture) => {
    const material = new THREE.MeshStandardMaterial({
        color: "#fff9fa",
        map: texture,
        //bumpMap: texture,
        //bumpScale: 0.1,
        //displacementMap: texture,
        //displacementScale: 0.0,
        side: THREE.BackSide,
        metalness: 0.0,
        roughness: 1.0,
        roughnessMap: texture
    });
    material.dithering = true;
    return material;
};

const createRoom = (assets) => {
    const size = 10;
    const width = size;
    const depth = size;
    const height = size / 2;

    const detail = 100;
    const geometry = 
        new THREE.BoxBufferGeometry(width, height, depth, detail, detail, detail);

    const textures = assets.textures.walls;
    const materials = textures.map(createFaceMaterial);

    return new THREE.Mesh( geometry, materials );
};

export { createRoom };