import * as THREE from 'three';
import { ASSETHANDLER } from '../../systems/assets/AssetHandler';

import concrete from '../../../assets/textures/concrete1.png'



const createTorusKnot = () => {
    const texture = ASSETHANDLER.loadTexture(concrete);

    const geometry = new THREE.TorusKnotBufferGeometry( 1, 0.1, 200, 100 );
    const material = new THREE.MeshStandardMaterial( { 
        map: texture,
        metalness: 1.0,
        roughness: 0.8,
        bumpMap: texture,
        bumpScale: 0.1
    } );
    const torusKnot = new THREE.Mesh( geometry, material );
    torusKnot.castShadow = true;
    return torusKnot;
};

export { createTorusKnot }