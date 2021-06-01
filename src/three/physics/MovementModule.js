export class MovementModule {
    constructor(position, velocity, acceleration, friction, speed) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.friction = friction;
        this.speed = speed;
    }

    addForce(force) {
        this.acceleration.add(force);
    }

    update(delta) {
        // Delta is the time (in seconds) since last update

        // Update velocity using acceleration
        this.velocity.add(this.acceleration.multiplyScalar(this.speed * delta));

        // Update position using velocity
        this.position.add(this.velocity.clone().multiplyScalar(delta));

        // Apply friction
        this.velocity.multiplyScalar(1.0 - this.friction);

        // Reset acceleration
        this.acceleration.multiplyScalar(0.0);
    }
}