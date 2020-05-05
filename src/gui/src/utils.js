export const dataRange = {
    'uint8': { min: 0, max: (1 << 8) - 1, display: val => toHexText(val, 2) },
    'uint16': { min: 0, max: (1 << 16) - 1, toByte: (val) => [val & 0xff, val >> 8], display: val => toHexText(val, 4) },
    'int8': { min: -(1 << 7), max: (1 << 7) - 1, display: val => toHexText(val >= 0 ? val : val + 256, 2) },
};

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

export function toHexText(value, precision) {
    return '0x' + value.toString(16).padStart(precision, '0').toUpperCase();
}