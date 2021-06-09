import * as THREE from 'three'

import { MovementModule } from '../../systems/physics/MovementModule'
import { RotationModule } from '../../systems/physics/RotationModule'


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

        // Module for handling zoom (fov change)
        this._zoomModule = {
            amount: 1.0,
            min: 0.05,
            max: 10,
            velocity: 0.0,  
            speed: 0.02,     
            friction: 0.1,

            // Function for adding zoom (adds to velocity)
            zoom: (direction) => {
                if(direction === "in") {
                    this._zoomModule.velocity += this._zoomModule.speed;
                } else {
                    this._zoomModule.velocity -= this._zoomModule.speed;
                }
            },

            // Function for updating zoom
            update: () => {
                // Update zoom
                var amount = this._zoomModule.amount * (1 + this._zoomModule.velocity);
                // and limit to min and max values
                amount = Math.min(
                    Math.max(
                        amount,
                        this._zoomModule.min
                    ),
                    this._zoomModule.max
                );
                this._zoomModule.amount = amount;
                this.zoom = amount;

                this.updateProjectionMatrix();

                // Reduce velocity based on friction
                this._zoomModule.velocity *= 1 - this._zoomModule.friction;
            }
        };

        // 
        //this.setForward(this._rotationModule.initialForward);
        this._lookForward();
    }

    update(delta) {
        // MOVEMENT
        this._movementModule.update(delta);

        // FACING
        // If look at position is set, look in this direction 
        if(this.lookAtPosition) {
           this.lookAt(this.lookAtPosition);
        } else {
            this._rotationModule.update(delta);
            this._lookForward();
        }

        // ZOOM
        this._zoomModule.update();
    }

    //////////
    // ZOOM //
    //////////

    addZoom(direction) {
        this._zoomModule.zoom(direction);
    }

    //////////////
    // MOVEMENT //
    //////////////
    
    addForce(force) {
        this._movementModule.addForce(force);
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