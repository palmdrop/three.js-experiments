import * as THREE from 'three'

class CameraRig {
    constructor(camera) {
        this.camera = camera;
        if(!camera) throw new Error("Camera cannot be null");
    }


    getCamera() {
        return this.camera;
    }

}