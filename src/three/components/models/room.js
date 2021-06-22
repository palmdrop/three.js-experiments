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

const createRoof = () => {
    const thickness = 2;

    const y = GLOBALS.roomDimensions.height / 2;
    const minX = -GLOBALS.roomDimensions.width / 2;
    const minZ = -GLOBALS.roomDimensions.depth / 2;

    const width = GLOBALS.roomDimensions.width;
    const depth = GLOBALS.roomDimensions.depth;

    const material = createFaceMaterial(ASSETHANDLER.loadTexture(wall1, "#232323"), "#ffffff", THREE.FrontSide);

    const createComponent = (x, z, lengthX, lengthZ) => {
        const geometry = new THREE.BoxBufferGeometry(lengthX, thickness, lengthZ, 2, 2, 2);
        //geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(x - minX, y + thickness/2, z - minY));
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            x + lengthX / 2, 
            y + thickness / 2, 
            z + lengthZ / 2
        );
        return mesh;
    }

    const roof = new THREE.Object3D();

    roof.add(createComponent(minX, minZ, width, depth / 2.5));
    roof.add(createComponent(minX, minZ + depth - depth / 2.5, width, depth / 2.5));

    roof.add(createComponent(minX, minZ + depth / 2.5, width / 4, depth / 5));
    roof.add(createComponent(minX + width - width / 4, minZ + depth / 2.5, width / 4, depth / 5));

    const holeSize = 1.0;
    roof.add(createComponent(minX + width / 4 + holeSize, minZ + depth / 2.5, 2 * width / 4 - 2 * holeSize, depth / 5));

    return {
        roof: roof, 
        lightPositions: [
            new THREE.Vector3(minX + width / 4 + holeSize / 2, y + thickness / 2, ),
            new THREE.Vector3(minX + width - width / 4 - holeSize / 2, y + thickness / 2, )
        ]
    };
};

const createFaceMaterial = (texture, color, side) => {
    if(typeof side === "undefined") side = THREE.BackSide;
    const material = new THREE.MeshStandardMaterial({
        color: color | "#ffffff",
        map: texture,
        bumpMap: texture,
        bumpScale: 0.1,
        side: side,
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

    const detail = 2;
    const geometry = 
        new THREE.BoxBufferGeometry(width, height, depth, detail, detail, detail);

    const faces = {
        right: {
            texture: ASSETHANDLER.loadTexture(darkWall)
        }, 
        left: { 
            texture: ASSETHANDLER.loadTexture(darkWall)
        },
        top: {
            texture: ASSETHANDLER.loadTexture(wall1, "#232323"), 
            side: THREE.FrontSide
        },
        bottom: {
            texture: ASSETHANDLER.loadTexture(wall1, "#232323"), 
        },
        back: {
            texture: ASSETHANDLER.loadTexture(darkWall), 
        },
        front: {
            texture: ASSETHANDLER.loadTexture(darkWall), 
        },
    };

    const materials = Object.keys(faces).map(key => {
        const face = faces[key];
        return createFaceMaterial(face.texture, '#ffffff', face.side);
    });
    //const materials = textures.map(createFaceMaterial);

    const mainRoom = new THREE.Mesh( geometry, materials );
    mainRoom.receiveShadow = true;

    const {roof, lightPositions} = createRoof();

    const room = new THREE.Object3D();
    room.add(mainRoom);
    room.add(roof);

    return [room, lightPositions];
};

export { createRoom };