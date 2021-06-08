import * as THREE from 'three'

const createLights = () => {
    // Create light
    const light1 = new THREE.PointLight(
        0xFF897F, // Color
        12,        // Intensity
        14,       // Distance
        2         // Decay
    );
    light1.position.set(4, 4, 3);

    const light2 = new THREE.PointLight(
        0x7A886F, // Color
        15,        // Intensity
        14,       // Distance
        2         // Decay
    );
    light2.position.set(-2, -3, -3);

    const light3 = new THREE.PointLight(
        0x8A888F, // Color
        10,        // Intensity
        7,       // Distance
        2         // Decay
    );
    light3.position.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight( 0x202020 );

    return [light1, light2, light3, ambientLight];
};

export { createLights }