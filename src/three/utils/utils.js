const cloneToVector3 = (source, destination) => {
    destination.set(
        source.x,
        source.y,
        source.z
    );
    return destination;
};


export {
    cloneToVector3
}