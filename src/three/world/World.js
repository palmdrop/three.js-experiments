import * as THREE from 'three'

import { createRenderer } from '../systems/render/renderer'
import { createScene } from '../components/scene/scene'
import { createCamera } from '../components/camera/camera'
import { createTorusKnot } from '../components/models/torusKnot';
import { createRoom } from '../components/models/room';
import { createLights } from '../components/light/createLights';
import { Resizer } from '../systems/resize/Resizer';

let GLOBALS = {
    far: 50,
    near: 0.1,
    backgroundColor: 0x054443
};

class World {
    constructor(canvas, assetHandler) {
        this.assetHandler = assetHandler;

        // RENDERER
        this.renderer = createRenderer(canvas);
        this.canvas = this.renderer.domElement; // Canvas will be created if none is supplied

        // CAMERA
        const {camera, rig} = createCamera(this.canvas.width, this.canvas.height);
        this.camera = camera;
        this.cameraRig = rig;

        this.torusKnot = createTorusKnot(this.assetHandler.textures.walls);
        this.torusKnot.update = function(delta, time) {
            this.rotation.x += 0.1 * delta;
            this.rotation.y += 0.2 * delta;
        };

        this.cube = createRoom(this.assetHandler.textures.walls);
        this.lights = createLights();

        // SCENE
        this.scene = createScene(GLOBALS.backgroundColor);

        // Add all objects to scene
        this.scene.add( 
            this.cube, 
            this.torusKnot,
            ...this.lights
        );

        // RESIZE
        this.resizer = new Resizer(this.canvas, this.camera, this.renderer, true);
    }

    resize() {
        this.resizer.resize();
    }

    update(delta, time) {

        this.camera.update(delta, time);

        // Traverse scene and call update on each object that has
        // an update function

        // this method will also check if an object has an update function
        // and if yes, store in separate structure and only update objects that needs update!!!!!
        this.scene.traverse(object => {
            if(typeof object.update === "function") {
                object.update(delta, time);
            }
        });
    }

    render() {
        // Render the scene
        this.renderer.render( this.scene, this.camera );
    }
}


export {
    World,
    GLOBALS
}