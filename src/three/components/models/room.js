import * as THREE from 'three'
import { ASSETHANDLER } from '../../systems/assets/AssetHandler';
import { GLOBALS } from '../../world/World'

import c1 from '../../../assets/textures/concrete1.png'
import c2 from '../../../assets/textures/concrete2.png'
import c3 from '../../../assets/textures/concrete3.png'
import c4 from '../../../assets/textures/concrete4.png'
import c5 from '../../../assets/textures/concrete5.png'

import brickWall1 from '../../../assets/textures/brick-wall1.jpg'
import brickWall2 from '../../../assets/textures/brick-wall2.jpg'
import darkWall from '../../../assets/textures/dark-wall.jpg'
import wall1 from '../../../assets/textures/wall1.jpg'
import wall2 from '../../../assets/textures/wall2.jpg'

const createFaceMaterial = (texture, color) => {
    const material = new THREE.MeshStandardMaterial({
        color: color | "#ffffff",
        map: texture,
        bumpMap: texture,
        bumpScale: 0.1,
        side: THREE.BackSide,
        metalness: 0.0,
        roughness: 0.8,
    });
    material.dithering = true;
    return material;
};

const createRoom = () => {
    const width = GLOBALS.roomDimensions.width;
    const depth = GLOBALS.roomDimensions.depth;
    const height = GLOBALS.roomDimensions.height;

    const detail = 100;
    const geometry = 
        new THREE.BoxBufferGeometry(width, height, depth, detail, detail, detail);

    const textures = [
        ASSETHANDLER.loadTexture(darkWall), // Right wall
        ASSETHANDLER.loadTexture(darkWall), // Left wall
        ASSETHANDLER.loadTexture(wall1, "#232323"), // Roof
        ASSETHANDLER.loadTexture(wall1, "#232323"), // Floor
        ASSETHANDLER.loadTexture(darkWall), // Back wall
        ASSETHANDLER.loadTexture(darkWall), // Front wall
    ];
    const materials = textures.map(createFaceMaterial);

    const mesh =  new THREE.Mesh( geometry, materials );
    mesh.receiveShadow = true;

    return mesh;
};

export { createRoom };