import * as THREE from 'three'

import { MovementModule } from '../physics/MovementModule'

export class PhysicsCamera extends THREE.PerspectiveCamera {
    constructor(...args) {
        super(...args);

        this.movementModule = new MovementModule(
            this.position,
            new THREE.Vector3(), // Velocity
            new THREE.Vector3(), // Acceleration
            0.02, // Friction
            4.6   // Speed
        );
    }

    //////////////
    // MOVEMENT //
    //////////////
    
    addForce(force) {
        this.movementModule.addForce(force);
    }

    update(delta) {
       this.movementModule.update(delta);
       if(this.lookAtPosition) {
            this.lookAt(new THREE.Vector3());
       }
    }

    /////////////
    // LOOK AT //
    /////////////

    lookAt(position) {
        this.lookAtPosition = position;
        super.lookAt(position);
    }
}