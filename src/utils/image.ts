export async function globImage(glob: Record<string, () => Promise<unknown>>) {
    let pictures: ImageMetadata[] = [];

    const unprocessed = Object.values(glob)
        .map(async x => await x());

    for (let x of unprocessed) {
        const pic: { default: ImageMetadata } = (await x) as {
            default: ImageMetadata
        };
        pictures.push(pic.default);
    }

    return pictures;
}
