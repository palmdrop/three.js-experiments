import * as THREE from 'three'

const createLights = () => {
    // Create light
    const light1 = new THREE.PointLight(
        0xFF897F, // Color
        500,        // Intensity
        15,       // Distance
        2         // Decay
    );
    light1.position.set(4, 4, 3);

    const light2 = new THREE.PointLight(
        0x7A886F, // Color
        500,        // Intensity
        15,       // Distance
        2         // Decay
    );
    light2.position.set(-2, -3, -3);

    const light3 = new THREE.PointLight(
        0x8A888F, // Color
        500,        // Intensity
        7,       // Distance
        2         // Decay
    );
    light3.position.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight( 0x202020 );

    // Create a directional light
    //const light = new THREE.DirectionalLight('white', 8);

    // move the light right, up, and towards us
    //light.position.set(10, 10, 10);

    return [light1, light2, light3, ambientLight];
};

export { createLights }