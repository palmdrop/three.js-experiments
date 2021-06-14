import * as THREE from 'three'

const createLights = () => {
    // Create light
    const light1 = new THREE.PointLight(
        0xFFD99F, // Color
        20,        // Intensity
        15,       // Distance
        2         // Decay
    );
    light1.position.set(0, 2, 0);

    light1.castShadow = true;
    light1.shadow.radius = 7;

    // Ambient/hemisphere

    const ambientLight = new THREE.AmbientLight( 0x202020 );

    const hemisphereLight = new THREE.HemisphereLight(0x665533, 0x334455, 1);

    // Moving light

    const movingLight = new (class extends THREE.Group {
        constructor() {
            super();

            const numberOfLights = 3;
            const orbit = 2.5;

            for(var i = 0; i < numberOfLights; i++) {
                var color;

                switch(i) {
                    case 0: color = 0xFF0000; break;
                    case 1: color = 0x00FF00; break;
                    case 2: color = 0x0000FF; break;
                }


                const light = new THREE.PointLight(
                    color, // Color
                    100,      // Intensity
                    17,       // Distance
                    4         // Decay
                );

                light.position.set(
                    orbit * Math.cos(2 * Math.PI * i / numberOfLights),
                    0,
                    orbit * Math.sin(2 * Math.PI * i / numberOfLights),
                );

                //light.castShadow = true;

                this.add(light);
            }
        }

        update(delta = 0, time = 0) {
            this.rotation.y += delta * 1;

            this.scale.set(
                Math.cos(time),
                Math.cos(time),
                Math.cos(time)
            );
        }
    })();

    movingLight.position.set(0.000, 0, 0);

    return [
        light1, 
        hemisphereLight,
        movingLight,
        ambientLight];
};

export { createLights }