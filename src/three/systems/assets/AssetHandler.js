import * as THREE from 'three'

import { GLOBALS } from '../../world/World'

import t1 from '../../../assets/images/warp3.png'

import c1 from '../../../assets/textures/concrete1.png'
import c2 from '../../../assets/textures/concrete2.png'
import c3 from '../../../assets/textures/concrete3.png'
import c4 from '../../../assets/textures/concrete4.png'
import c5 from '../../../assets/textures/concrete5.png'

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
            //walls: this._loadTexture(t1),
            walls: [
                this._loadTexture(c5),
                this._loadTexture(c2),
                this._loadTexture(c3),
                this._loadTexture(c1),
                this._loadTexture(c4),
                this._loadTexture(c1),
            ]
        };
    }
};

export {
    AssetHandler
}
