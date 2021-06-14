import * as THREE from 'three'
import { ASSETHANDLER } from '../../systems/assets/AssetHandler';

import c1 from '../../../assets/textures/concrete1.png'
import c2 from '../../../assets/textures/concrete2.png'
import c3 from '../../../assets/textures/concrete3.png'
import c4 from '../../../assets/textures/concrete4.png'
import c5 from '../../../assets/textures/concrete5.png'

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

const createRoom = () => {
    const size = 10;
    const width = size;
    const depth = size;
    const height = size / 2;

    const detail = 100;
    const geometry = 
        new THREE.BoxBufferGeometry(width, height, depth, detail, detail, detail);

    const textures = [
        ASSETHANDLER.loadTexture(c1),
        ASSETHANDLER.loadTexture(c2),
        ASSETHANDLER.loadTexture(c3),
        ASSETHANDLER.loadTexture(c4),
        ASSETHANDLER.loadTexture(c5),
        ASSETHANDLER.loadTexture(c4),
    ];
    const materials = textures.map(createFaceMaterial);

    const mesh =  new THREE.Mesh( geometry, materials );
    mesh.receiveShadow = true;

    return mesh;
};

export { createRoom };