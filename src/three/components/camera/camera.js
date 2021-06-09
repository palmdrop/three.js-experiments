import { PhysicsCamera } from './PhysicsCamera'
import { CameraRig } from './CameraRig'

import { GLOBALS } from '../../world/World'

const createCamera = (width, height) => {
    const camera = new PhysicsCamera(
        50,           // fov
        width/height, // Aspect ratio
        GLOBALS.near, // near
        GLOBALS.far   // far
    );
    camera.position.z = 10; // Move camera away from scene

    // Create rig (for smooth camera controls)
    const rig = new CameraRig(camera);

    // Return both the camera (required to render the scene)
    // and the rig (called in update to move the camera)
    return {camera, rig};
};

export { createCamera }