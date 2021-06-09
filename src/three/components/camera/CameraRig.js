import * as THREE from 'three'

export class CameraRig {
    constructor(camera) {
        this.camera = camera;

        // For mouse drag movement
        this.anchor = {
            anchored: false,
            previous: null,
            current: null,
            sensitivity: 0.05
        };

        if(!camera) throw new Error("Camera cannot be null");
    }

    zoom(direction) {
        this.camera.addZoom(direction);
    }

    move(direction) {
        const forward = this.camera.getForward();
        const right = this.camera.getWorldDirection(new THREE.Vector3()).clone().cross(this.camera.up);
        right.normalize();

        switch(direction)
        {
            case 'up': 
                this.camera.addForce(forward);
            break;
            case 'left': 
                this.camera.addForce(right.multiplyScalar(-1));
            break;
            case 'down': 
                this.camera.addForce(forward.clone().multiplyScalar(-1));
            break;
            case 'right': 
                this.camera.addForce(right.multiplyScalar(1));
            break;
        }
    }

    look(direction) {
        const right = this.camera.getWorldDirection(new THREE.Vector3()).clone().cross(this.camera.up);
        right.normalize();
        const speed = 1.0
        const rotation = new THREE.Vector3();

        switch(direction) 
        {
            case 'up': 
                rotation.x = speed;
            break;
            case 'left': 
                rotation.y = speed;
            break;
            case 'down': 
                rotation.x = -speed;
            break;
            case 'right': 
                rotation.y = -speed;
            break;
        }
        this.camera.addRotation(rotation, true);
    }


    setAnchor(anchored, startPosition) {
        if(!anchored) startPosition = null;
        this.anchor.anchored = anchored;
        this.anchor.current  = startPosition;
        this.anchor.previous = startPosition;
    }

    anchorRotate(currentPosition) {
        if(!this.anchor.anchored) return;
        this.anchor.previous = this.anchor.current;
        this.anchor.current = currentPosition;

        this.offset = this.anchor.current.clone().sub(this.anchor.previous);
        this.offset.multiplyScalar(this.anchor.sensitivity);

        this.camera.addRotation(this.offset, true);
    }


    getCamera() {
        return this.camera;
    }

}