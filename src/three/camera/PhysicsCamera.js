import * as THREE from 'three'

import { MovementModule } from '../physics/MovementModule'

export class PhysicsCamera extends THREE.PerspectiveCamera {
    constructor(...args) {
        super(...args);

        this.movementModule = new MovementModule(
            this.position,
            new THREE.Vector3(), // Velocity
            new THREE.Vector3(), // Acceleration
            6.0, // Friction
            30   // Speed
        );

        this.rotationVelocity = new THREE.Vector3();
        this.rotationFriction = 6.0;
        this.rotationSpeed = 20;
        this.setForward(new THREE.Vector3(0, 0, -1));
    }

    //////////////
    // MOVEMENT //
    //////////////
    
    addForce(force) {
        this.movementModule.addForce(force);
    }

    update(delta) {
        // Update position, velocity and acceleration
        this.movementModule.update(delta);

        // If look at position is set, look in this direction 
        if(this.lookAtPosition) {
           this.lookAt(this.lookAtPosition);
        } 

        // Rotate 
        if(this.rotationVelocity.lengthSq() !== 0) {
           this.rotate(this.rotationVelocity.clone().multiplyScalar(delta * this.rotationSpeed));
           this.rotationVelocity.multiplyScalar(1.0 - this.rotationFriction * delta);
        }
    }

    ////////////
    // FACING //
    ////////////

    lookAtLock(position) {
        this.lookAtPosition = position;
        super.lookAt(position);
    }

    setForward(forward) {
        this.forward = forward;
        this.lookAtPosition = null;
        super.lookAt(this.position.clone().add(forward));
    }

    addRotation(rotation, preserveRotationMomentum = false) {
        this.preserveRotationMomentum = preserveRotationMomentum;
        this.rotationVelocity.add(rotation);
    }

    rotate(rotationVelocity) {
        // Fetch the three axis of the camera
        const up = this.up;
        const forward = this.forward;
        const right = forward.clone().cross(up);
        right.normalize();

        // Quaternion for performing rotation
        const quaternion = new THREE.Quaternion();

        // Current rotation velocity

        // Pitch

        const pitch = rotationVelocity.x;
        quaternion.setFromAxisAngle(
            right,
            pitch
        );
        forward.applyQuaternion(quaternion);

        // Yaw
        const yaw = rotationVelocity.y;
        quaternion.setFromAxisAngle(
            up,
            yaw
        );
        forward.applyQuaternion(quaternion);


        // Roll
        const roll = rotationVelocity.z;
        quaternion.setFromAxisAngle(
            forward,
            roll
        );
        forward.applyQuaternion(quaternion);

        this.setForward(forward);
    }
}