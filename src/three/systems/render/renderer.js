import { WebGLRenderer } from 'three';

const createRenderer = (options) => {
    const renderer = new WebGLRenderer(options);
    return renderer;
}

export { createRenderer };