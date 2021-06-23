import * as THREE from 'three';

import { cloneToVector3 } from '../../utils/utils'

export class MovementModule {
    constructor(position, velocity, acceleration, friction, speed) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.friction = friction;
        this.speed = speed;

        this.tempVector = new THREE.Vector3(0, 0, 0);

        // Should be an object containing three functions:
        // isOutside(Vector2) : Boolean
        // getVelocity(Vector2, Number) : Vector3
        this.restrict = null;
    }

    addForce(force) {
        this.acceleration.add(force);
    }

    update(delta) {
        // Delta is the time (in seconds) since last update

        if(this.restrict && this.restrict.isOutside(this.position)) {
            this.velocity.add(this.restrict.getVelocity(this.position, delta * this.speed));
        } else {
            // Update velocity using acceleration
            this.velocity.add(this.acceleration.multiplyScalar(this.speed * delta));
        }

        // Update position using velocity
        this.position.add(cloneToVector3(this.velocity, this.tempVector).multiplyScalar(delta));

        // Apply friction
        this.velocity.multiplyScalar(Math.max(1.0 - this.friction * delta, 0.0));

        // Reset acceleration
        this.acceleration.set(0, 0, 0);
    }
}