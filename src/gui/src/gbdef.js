import { PRIMITIVE, Struct, to_ptr } from "./ASMMemory";

const Gameboy = Struct();
const CPU = Struct();

Gameboy.declare('cpu', to_ptr(CPU));

CPU.declare('gb', to_ptr(Gameboy));
CPU.declare('A', PRIMITIVE.uint8);
CPU.declare('F', PRIMITIVE.uint8);
CPU.declare('B', PRIMITIVE.uint8);
CPU.declare('C', PRIMITIVE.uint8);
CPU.declare('D', PRIMITIVE.uint8);
CPU.declare('E', PRIMITIVE.uint8);
CPU.declare('H', PRIMITIVE.uint8);
CPU.declare('L', PRIMITIVE.uint8);
CPU.declare('SP', PRIMITIVE.uint16);
CPU.declare('PC', PRIMITIVE.uint16);

export const GBStruct = {
    Gameboy,
    CPU
};
