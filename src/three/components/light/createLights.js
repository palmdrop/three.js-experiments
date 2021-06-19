import * as THREE from 'three'
import { GLOBALS } from '../../world/World';

const createLights = () => {
    // Ceiling light
    const ceilingLight = new THREE.PointLight(
        //0xFFD98F, // Color
        0xFFFFFF,
        25,        // Intensity
        30,       // Distance
        1.5         // Decay
    );
    ceilingLight.position.set(0, GLOBALS.roomDimensions.height / 2 - 0.1, 0);

    ceilingLight.castShadow = true;
    ceilingLight.shadow.radius = 7;

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

    //const hemisphereLight = new THREE.HemisphereLight(0x665533, 0x334455, 1);
    //const directionalLight = new THREE.DirectionalLight(0xffffff, 1 );
    //directionalLight.position.set(5, 10, 20);

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
        ceilingLight, 
        cornerLight1,
        cornerLight2,
        //hemisphereLight,
        //directionalLight,
        //movingLight,
        ambientLight];
};

export { createLights }