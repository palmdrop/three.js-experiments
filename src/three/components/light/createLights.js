import * as THREE from 'three'
import { GLOBALS } from '../../world/World';

import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();

const createLights = (skylightPositions) => {
    const skylights = [];

    const skylightIntensity = 40;
    const skylightDistance = 40;
    skylightPositions.forEach(position => {
        const skylight = new THREE.PointLight(
            //0xFFD98F, // Color
            0xD0D0FF,
            skylightIntensity, // Intensity
            skylightDistance,  // Distance
            1.5                // Decay
        );
        skylight.position.set(position.x, position.y, position.z);
        skylight.castShadow = true;
        skylight.shadow.radius = 7;

        skylights.push(skylight);
    });

    // Corner lights
    const cornerOffset = 1.5;
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
    const skylightFlickerAmount = 0.5;
    const updateLights = (delta, time) => {
        const offsetX = time / 7.0;
        const offsetZ = -time / 12.0;

        for(var i = 0; i < skylights.length; i++) {
            const light = skylights[i];
            let n = simplex.noise3D(
                light.position.x + offsetX, 
                light.position.y, 
                light.position.z + offsetZ
            );

            n = skylightFlickerAmount * ((n + 1.0) / 2.0);
            light.intensity = skylightIntensity * (1.0 - n);
        }
    };

    // Light holder
    const lightHolder = new THREE.Object3D();
    lightHolder.add(
        ...skylights,
        cornerLight1,
        cornerLight2,
        ambientLight
    );
    lightHolder.update = updateLights;

    return lightHolder;
};

export { createLights }