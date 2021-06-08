import { PhysicsCamera } from './PhysicsCamera'
import { CameraRig } from './CameraRig'

const createCamera = (width, height) => {
    const camera = new PhysicsCamera(
        35,           // fov
        width/height, // Aspect ratio
        0.1,          // near
        1000          // far
    );
    camera.position.z = 10; // Move camera away from scene

    // Create rig (for smooth camera controls)
    const rig = new CameraRig(camera);

    // Return both the camera (required to render the scene)
    // and the rig (called in update to move the camera)
    return {camera, rig};
};

export { createCamera }