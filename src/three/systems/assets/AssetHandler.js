import * as THREE from 'three'

import t1 from '../../../assets/images/warp1.png'

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
