import { PRIMITIVE, Struct, to_ptr } from "./ASMMemory";

const Gameboy = Struct();
const CPU = Struct();

Gameboy.declare('cpu', to_ptr(CPU));

CPU.declare('gb', to_ptr(Gameboy));
CPU.declare('AF', PRIMITIVE.uint16);

export const GBStruct = {
    Gameboy,
    CPU
};
