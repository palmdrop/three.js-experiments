import { createRenderer } from '../systems/render/renderer'
import { createScene } from '../components/scene/scene'
import { createCamera } from '../components/camera/camera'
import { createRoom } from '../components/models/room';
import { createLights } from '../components/light/createLights';
import { createScreen } from '../components/models/screen';
import { loadModels } from '../components/models/createModels';
import { Resizer } from '../systems/resize/Resizer';

import backgroundImage from '../../assets/images/clouds1.jpg';
import { ASSETHANDLER } from '../systems/assets/AssetHandler';
import { Vector3 } from 'three';

let GLOBALS = {
    far: 50,
    near: 0.1,
    backgroundColor: 0x455443,

    useSRGB: false,

    roomDimensions: {
        width: 10,
        height: 7,
        depth: 10
    }
};

class World {
    constructor(canvas) {
        // Array of objects that require update each frame
        this.updateables = [];

        // RENDERER
        this.renderer = createRenderer(canvas);
        this.canvas = this.renderer.domElement; // Canvas will be created if none is supplied

        // CAMERA
        const {camera, rig} = createCamera(this.canvas.width, this.canvas.height);
        this.camera = camera;

        const radius = GLOBALS.roomDimensions.width / 2.5;
        this.camera._movementModule.restrict = {
            isOutside: (position) => {
                return position.lengthSq() > (radius * radius);
            },

            getVelocity: (position, strength) => {
                const dist = (position.length() - radius);
                const amount = strength * dist / radius;
                return new Vector3().sub(position).multiplyScalar(amount);
            }
        };


        this.cameraRig = rig;

        // SCENE
        this.scene = createScene(GLOBALS.backgroundColor);

        // MODELS
        const [room, skylightPositions] = createRoom();

        const [renderToScreen1, screen1] = createScreen(this.renderer, this.scene, this.camera, 
            GLOBALS.roomDimensions.width / 1.2,
            GLOBALS.roomDimensions.width / (1.2 * 2),
            "Twisted hallway",
            // Uniforms
            {
                tvShaderPass: {
                    warpOffset: [0.0, 0.0] 
                }
            } 
        );

        screen1.position.set(0, 0.5, -GLOBALS.roomDimensions.depth / 2 + 0.01 );
        screen1.rotation.z = 0.2;

        const [renderToScreen2, screen2] = createScreen(this.renderer, this.scene, this.camera, 
            GLOBALS.roomDimensions.width / 1.2,
            GLOBALS.roomDimensions.width / (1.2 * 1.3),
            "Warp",
            // Uniforms
            {
                tvShaderPass: {
                    warpOffset: [0.8, 0.8],
                    mirror: true,
                }
            } 
        );

        screen2.position.set(-GLOBALS.roomDimensions.width / 2 + 0.01, 0.0, 0);
        screen2.rotation.y = Math.PI / 2;

        const [renderToScreen3, screen3] = createScreen(this.renderer, this.scene, this.camera, 
            GLOBALS.roomDimensions.width / 1.2,
            GLOBALS.roomDimensions.width / (1.2 * 1.3),
            "Mirror",
            // Uniforms
            {
                tvShaderPass: {
                    warpOffset: [0.0, 0.0],
                    mirror: true,
                }
            } 
        );

        screen3.position.set(GLOBALS.roomDimensions.width / 2 - 0.01, 0.0, 0);
        screen3.rotation.y = -Math.PI / 2;

        // Screen render passes
        this.renderToScreens = [
            renderToScreen1,
            renderToScreen2,
            renderToScreen3,
        ];

        // LIGHTS
        const lights = createLights(skylightPositions);

        // Add all objects to scene
        this.scene.add( 
            room,
            screen1,
            screen2,
            screen3,
            lights
        );

        // Background
        this.scene.background = ASSETHANDLER.loadTexture(backgroundImage);

        // RESIZE
        this.resizer = new Resizer(this.canvas, this.camera, this.renderer, true);

        // Add objects to updateables array
        this.scene.traverse(object => {
            if(typeof object.update === "function") {
                this.updateables.push(object);
            }
        });
        this.updateables.push(this.camera);
    }

    async initialize() {
        const models = await loadModels();
        const crate = models.crate;
        crate.position.set(
            -GLOBALS.roomDimensions.width/2 + 1.5, 
            -GLOBALS.roomDimensions.height / 2 + 1.0, 
            -GLOBALS.roomDimensions.depth / 2 + 1.5);
        crate.rotation.y += 0.3;

        this.scene.add(crate);

        const conditionaire = models.conditionaire;

        conditionaire.scale.set(0.5, 0.5, 0.5);
        conditionaire.position.set(
            2,
            0.0,
            GLOBALS.roomDimensions.depth / 2 - 0.5 
        );
        conditionaire.rotation.y += Math.PI;

        this.scene.add(models.conditionaire);


        const lamp = models.lamp;
        lamp.scale.set(0.1, 0.3, 0.1);
        lamp.position.set(
            GLOBALS.roomDimensions.width/2 - 1.0, 
            GLOBALS.roomDimensions.height / 4 - 0.0, 
            -GLOBALS.roomDimensions.depth / 2 + 1.5
        );

        this.scene.add(models.lamp);
    }

    resize() {
        this.resizer.resize();
    }

    update(delta, time) {
        this.updateables.forEach((object) => {
            object.update(delta, time);
        });
    }

    render(delta, time) {
        this.renderToScreens.forEach(renderToScreen => {
            renderToScreen(delta, time);
        });

        // Render the scene
        this.renderer.setRenderTarget(null);
        this.renderer.render( this.scene, this.camera );
    }
}


export {
    World,
    GLOBALS
}