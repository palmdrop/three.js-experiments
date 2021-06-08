import * as THREE from 'three'

import { createRenderer } from '../systems/render/renderer'
import { createScene } from '../components/scene/scene'
import { createCamera } from '../components/camera/camera'
import { createTorusKnot } from '../components/models/torusKnot';
import { createRoom } from '../components/models/room';
import { createLights } from '../components/light/createLights';
import { Resizer } from '../systems/resize/Resizer';

class World {
    constructor(canvas, resources) {
        this.canvas = canvas;
        this.resources = resources;

        // RENDERER
        this.renderer = createRenderer({
            canvas: canvas,
            antialias: true
        });

        this.canvas = this.renderer.domElement;

        // CAMERA
        const {camera, rig} = createCamera(this.canvas.width, this.canvas.height);
        this.camera = camera;
        this.cameraRig = rig;

        // FOG
        const backgroundColor = 0x054443;

        // SCENE
        this.scene = createScene(backgroundColor);
        this.torusKnot = createTorusKnot(this.resources.textures.walls);
        this.cube = createRoom(this.resources.textures.walls);
        const lights = createLights();

        // And add to scene
        this.scene.add( this.cube );
        this.scene.add( this.torusKnot );

        lights.forEach(light => {
            this.scene.add( light );
        });

        this.resizer = new Resizer(this.canvas, this.camera, this.renderer, true);
    }

    resize() {
        this.resizer.resize();
    }

    update(delta) {
        this.torusKnot.rotation.x += 0 * delta;
        this.torusKnot.rotation.y += 0 * delta;

        this.camera.update(delta);
    }

    render() {
        // Render the scene
        this.renderer.render( this.scene, this.camera );
    }
}


export {
    World
}