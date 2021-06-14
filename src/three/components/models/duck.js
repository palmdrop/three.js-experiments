import { ASSETHANDLER } from "../../systems/assets/AssetHandler";
import duckPath from '../../../assets/models/Duck.glb'

import { forEachChild } from "../../../utils/Utils";

const setupModel = (data) => {
    const model = data.scene.children[0];
    model.castShadow = true;
    model.receiveShadow = false;

    forEachChild(model, (child) => {
        child.castShadow = true;
        child.receiveShadow = false;
    });

    model.position.set(0, -2, 0);

    return model;
};

async function loadDuck(){
    const duck = await ASSETHANDLER.loadGLTF(duckPath);
    const duckModel = setupModel(duck);
    return duckModel;
};

export { loadDuck }