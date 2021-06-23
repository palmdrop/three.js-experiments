import { ASSETHANDLER } from "../../systems/assets/AssetHandler";
import lampPath from '../../../assets/models/lamp1.glb';
import conditionairePath from '../../../assets/models/conditionaire.glb'
import cratePath from '../../../assets/models/crate.glb'

import { forEachChild } from "../../../utils/Utils";

const setupModel = (model) => {
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
    const duck = await ASSETHANDLER.loadGLTF(lampPath);
    const model = setupModel(duck.scene.children[0]);
    return model;
};

async function loadLamp(){
    const lamp = await ASSETHANDLER.loadGLTF(lampPath);
    const model = setupModel(lamp.scene.children[2]);
    return model;
};

async function loadCrate(){
    const crate = await ASSETHANDLER.loadGLTF(cratePath);
    const model = setupModel(crate.scene);
    return model;
};

async function loadConditionaire(){
    const conditionaire = await ASSETHANDLER.loadGLTF(conditionairePath);
    const model = setupModel(conditionaire.scene.children[0]);
    return model;
};

async function loadModels() {
    return {
        //duck: await loadDuck(),
        lamp: await loadLamp(),
        crate: await loadCrate(),
        conditionaire: await loadConditionaire(),
    };
}

export { loadModels }