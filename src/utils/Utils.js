
const forEachChild = (object, operation) => {
    if(!object.children) return;

    object.children.forEach((child) => {
        operation(child);
        forEachChild(child);
    });
}



export {
    forEachChild
}