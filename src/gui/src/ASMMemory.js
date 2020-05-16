export const heap = window.Module.HEAPU8;

export const DATA_TYPE = {
    primitive: Symbol("primitive"),
    pointer: Symbol("pointer"),
    struct: Symbol("struct"),
}

export const Struct = () => {
    return {
        type: DATA_TYPE.struct,
        members: [],
        size: 0,
        declare(name, member) {
            if (this[name]) {
                console.error("A member with the same name has already been declaread: " + name);
                return;
            }
            this.members.push(name);
            this[name] = member;
            this.size += member.size;
        },
    };
}

const little_endian = (raw, size) => {
    if (size > 4) {
        console.error("cannot construct integer has more than 32 bits");
        return;
    }
    let data = 0;
    for (let i = 0; i < size; i++) {
        data += raw[i] << (i * 8);
    }
    return data;
};

export const dereference = (ptr, def) => {
    if (def.type === DATA_TYPE.primitive) {
        return def.dereference(heap.slice(ptr, ptr + def.size));
    } else if (def.type === DATA_TYPE.pointer) {
        return { ptr: def.dereference(heap.slice(ptr, ptr + def.size)), struct: def.struct };
    } else if (def.type === DATA_TYPE.struct) {
        const struct = {
            deref(name) {
                if (!this[name] || !this[name].struct) {
                    console.error("No pointer member: " + name);
                    return;
                }
                const member = this[name];
                return dereference(member.ptr, member.struct);
            }
        };
        for (const name of def.members) {
            const member = def[name];
            struct[name] = dereference(ptr, member);
            ptr += member.size;
        }
        return struct;
    }
}

export const to_ptr = (struct) => {
    return {
        type: DATA_TYPE.pointer,
        name: "pointer",
        dereference: (raw) => little_endian(raw, 4),
        size: 4,
        struct
    };
}

export const PRIMITIVE = {
    uint8: {
        type: DATA_TYPE.primitive,
        name: "uint8",
        dereference: (raw) => little_endian(raw, 1),
        size: 1
    },
    uint16: {
        type: DATA_TYPE.primitive,
        name: "uint16",
        dereference: (raw) => little_endian(raw, 2),
        size: 2
    }
};