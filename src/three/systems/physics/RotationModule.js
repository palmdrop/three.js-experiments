import * as THREE from 'three';

import { cloneToVector3 } from '../../utils/utils'

// Module for handling rotation
export class RotationModule {
    constructor(preserveMomentum, friction, speed) {
        // Current rotation velocity
        this.velocity = new THREE.Vector3();

        // Specifies if momentum will be preserved or not
        // If not, velocity will be set to 0 each update
        this.preserveMomentum = preserveMomentum;

        // Speed of rotation
        this.speed = speed;

        // Friction of rotation
        // friction = 0.5 will halv velocity each second
        this.friction = friction;

        // Current rotation
        this.rotation = new THREE.Vector3(0, 0, 0);

        // Initial forward rotation
        // Used to calculate next forward direction
        this.initialForward = new THREE.Vector3(0, 0, -1);

        // Current forward direction (rotation applied to intiial forward direction)
        this.forward = this.initialForward;

        // Temporary vectors
        this.tempVector = new THREE.Vector3(0, 0, 0);
    }

    // Updates the rotation
    update(delta) {
        // Do nothing if no velocity 
        if(this.velocity.lengthSq() === 0) return;

        // Add rotation velocity to current rotation
        this._rotate(cloneToVector3(this.velocity, this.tempVector).multiplyScalar(delta * this.speed));

        // If momentum should be preserved, apply friction
        if(this.preserveMomentum) {
            this.velocity.multiplyScalar(Math.max(1.0 - this.friction * delta, 0.0));
        } else {
            // Otherwise, set to 0
            this.velocity.set(0, 0, 0);
        }
    }

    // Adds a rotation force
    addRotation(rotation, preserveRotationMomentum = false) {
        this.preserveMomentum = preserveRotationMomentum;
        this.velocity.add(rotation);
    }

    // Applies rotation to forward direction
    _rotate(amount) {
        // Update current rotation
        const rotation = this.rotation;
        rotation.add(amount);

        // Lock the rotation in X (pitch) to avoid gimbal lock
        const max = (Math.PI / 2 - 0.01);
        if(rotation.x < -max) rotation.x = -max;
        else if(rotation.x > max) rotation.x = max;

        // Create a euler transform 
        const euler = new THREE.Euler( 
            rotation.x,
            rotation.y,
            rotation.z,
            'ZYX' // Order of operations is important! XYZ does not produce desired result
        );

        // Update forward direction
        const newForward = this.initialForward.clone();
        newForward.applyEuler(euler);
        this.forward = newForward;
    }
};