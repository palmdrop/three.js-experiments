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
        16,       // Distance
        2         // Decay
    );
    light3.position.set(2, 0, 0);

    const ambientLight = new THREE.AmbientLight( 0x202020 );

    // Moving light

    const movingLight = new (class extends THREE.Object3D {
        constructor(...args) {
            super();

            const light = new THREE.PointLight(...args);
            light.position.set(5, 0, 0);

            this.add(light);

            //super(...args);
        }

        update(delta = 0, time = 0) {
            this.rotation.y += delta * 1;
        }
    })(
        0x8A888F, // Color
        200,        // Intensity
        17,       // Distance
        2         // Decay
    );
    movingLight.position.set(2, 0, 0);

    return [
        //light1, 
        //light2, 
        //light3, 
        movingLight,
        ambientLight];
};

export { createLights }