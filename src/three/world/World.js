import * as THREE from 'three'

import { createRenderer } from '../systems/render/renderer'
import { createScene } from '../components/scene/scene'
import { createCamera } from '../components/camera/camera'
import { createTorusKnot } from '../components/models/torusKnot';
import { createRoom } from '../components/models/room';
import { createLights } from '../components/light/createLights';
import { createScreen } from '../components/models/screen';
import { loadDuck } from '../components/models/duck';
import { Resizer } from '../systems/resize/Resizer';

//import hdri from '../../assets/hdri/partly-cloudy4k.hdr';
import hdri from '../../assets/hdri/round_platform.jpg';
import backgroundImage from '../../assets/images/clouds1.jpg';
import { ASSETHANDLER } from '../systems/assets/AssetHandler';

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
        this.cameraRig = rig;

        // SCENE
        this.scene = createScene(GLOBALS.backgroundColor);

        // MODELS
        const torusKnot = createTorusKnot();
        torusKnot.update = function(delta, time) {
            this.rotation.x += 0.1 * delta;
            this.rotation.y += 0.2 * delta;
        };

        const [room, skylightPositions] = createRoom();

        const [renderToScreen1, screen1, ] = createScreen(this.renderer, this.scene, this.camera, 
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

        const [renderToScreen2, screen2, ] = createScreen(this.renderer, this.scene, this.camera, 
            GLOBALS.roomDimensions.width / 1.2,
            GLOBALS.roomDimensions.width / (1.2 * 1.3),
            "Warp",
            // Uniforms
            {
                tvShaderPass: {
                    rotation: 0.2,
                }
            } 
        );

        screen2.position.set(-GLOBALS.roomDimensions.width / 2 + 0.01, 0.0, 0);
        screen2.rotation.y = Math.PI / 2;
        //screen2.rotation.z = 0.2;

        // Screen render passes
        this.renderToScreens = [
            renderToScreen1,
            renderToScreen2
        ];

        // LIGHTS
        const {updateLights, lights} = createLights(skylightPositions);

        // Add all objects to scene
        this.scene.add( 
            room,
            //this.torusKnot,
            screen1,
            screen2,
            ...lights
        );

        // HDRI
        /*const hdriTexture = ASSETHANDLER.loadImageHDRI(this.renderer, hdri, (texture) => {
            this.scene.background = texture;
        });*/
        this.scene.background = ASSETHANDLER.loadTexture(backgroundImage);
        //console.log(hdriTexture);

        //this.scene.background = hdriTexture;
        /*const loader = new THREE.TextureLoader();
        const texture = loader.load(hdri, () => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(this.renderer, texture);
            this.scene.background = rt.texture;
        });*/

        // RESIZE
        this.resizer = new Resizer(this.canvas, this.camera, this.renderer, true);

        // Add objects to updateables array
        this.scene.traverse(object => {
            if(typeof object.update === "function") {
                this.updateables.push(object);
            }
        });
        this.updateables.push(this.camera);

        // Create an object for updating the lights
        this.updateables.push({ update: updateLights });
    }

    async initialize() {
        const duck = await loadDuck();
        this.scene.add(duck);
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