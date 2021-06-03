import * as THREE from 'three'

import { MovementModule } from '../physics/MovementModule'
import { RotationModule } from '../physics/RotationModule'


// Camera with physics for movement and rotation
export class PhysicsCamera extends THREE.PerspectiveCamera {
    constructor(...args) {
        super(...args);

        // Module for handling movement physics
        this._movementModule = new MovementModule(
            this.position,
            new THREE.Vector3(), // Velocity
            new THREE.Vector3(), // Acceleration
            6.0, // Friction
            30   // Speed
        );

        // Module for handling rotation physics
        this._rotationModule = new RotationModule(
            false, // Preserve momentum
            6,     // Friction
            0.2,  // Speed
        );

        // 
        //this.setForward(this._rotationModule.initialForward);
        this._lookForward();
    }

    //////////////
    // MOVEMENT //
    //////////////
    
    addForce(force) {
        this._movementModule.addForce(force);
    }

    update(delta) {
        this._movementModule.update(delta);

        // If look at position is set, look in this direction 
        if(this.lookAtPosition) {
           this.lookAt(this.lookAtPosition);
        } else {
            this._rotationModule.update(delta);
            this._lookForward();
        }
    }

    ////////////
    // FACING //
    ////////////
    _lookForward() {
        this.lookAt(this.position.clone().add(this._rotationModule.forward));
    }

    lookAtLock(position) {
        this.lookAtPosition = position;
        super.lookAt(position);
    }

    addRotation(rotation, preserveRotationMomentum = false) {
        this._rotationModule.addRotation(rotation, preserveRotationMomentum);
    }

    getForward() {
        return this._rotationModule.forward;
    }
}