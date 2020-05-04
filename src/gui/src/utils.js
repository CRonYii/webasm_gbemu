export function readFileAsBinary(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const { result } = reader;
            if (result instanceof ArrayBuffer) {
                resolve(new Uint8Array(result));
            } else {
                reject('Failed to read file');
            }
        };
        reader.readAsArrayBuffer(file);
    });
}