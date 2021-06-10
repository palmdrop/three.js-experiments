import * as THREE from 'three'

import { GLOBALS } from '../../world/World'

import t1 from '../../../assets/images/warp3.png'

class AssetHandler {
    constructor() {
        this.loadManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadManager);
    }

    load(onProgress, onLoad) {
        this._loadResources();
        if(onLoad) this.loadManager.onLoad = onLoad;
        if(onProgress) this.loadManager.onProgress = onProgress;

        return this;
    }

    _loadTexture(path) {
        const texture = this.textureLoader.load(path);
        if(GLOBALS.useSRGB) texture.encoding = THREE.sRGBEncoding;
        return texture;
    }

    _loadResources() {
        this.textures = {
            walls: this._loadTexture(t1),
            test: this._loadTexture(t1)
        };
    }
};

export {
    AssetHandler
}
