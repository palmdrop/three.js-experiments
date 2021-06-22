import * as THREE from 'three'
import { GLOBALS } from '../../world/World';

const createLights = (skylightPositions) => {
    const skylights = [];

    skylightPositions.forEach(position => {
        const skylight = new THREE.PointLight(
            //0xFFD98F, // Color
            0xFFFFFF,
            30,        // Intensity
            30,       // Distance
            1.5         // Decay
        );
        skylight.position.set(position.x, position.y, position.z);
        skylight.castShadow = true;
        skylight.shadow.radius = 7;

        skylights.push(skylight);
    });

    // Corner lights
    const cornerOffset = 0.5;
    const cornerLight1 = new THREE.PointLight(
        0x7FFF88,
        30,
        30,
        2.0
    );
    cornerLight1.position.set(
        -GLOBALS.roomDimensions.width/2 + cornerOffset,
        -GLOBALS.roomDimensions.height / 2 + cornerOffset,
        -GLOBALS.roomDimensions.depth / 2 + cornerOffset,
    )

    const cornerLight2 = new THREE.PointLight(
        0x887766,
        30,
        30,
        2.0
    );
    cornerLight2.position.set(
        GLOBALS.roomDimensions.width/2 - cornerOffset,
        GLOBALS.roomDimensions.height / 2 - cornerOffset,
        -GLOBALS.roomDimensions.depth / 2 + cornerOffset,
    )

    // Ambient/hemisphere
    const ambientLight = new THREE.AmbientLight( 0x202020 );

    // Update function for lights
    // Used to create more dynamic lighting

    const updateLights = (delta, time) => {
        console.log(time);
    };

    return {
        updateLights,
        lights: [
            ...skylights, 
            cornerLight1,
            cornerLight2,
            ambientLight
        ]
    };
};

export { createLights }