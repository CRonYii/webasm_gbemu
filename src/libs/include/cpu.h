#pragma once

#include "gbdef.h"
#include "gameboy.h"

typedef struct CPU CPU;

struct CPU
{
    struct Gameboy *gb;
    reg_16 AF;
    reg_16 BC;
    reg_16 DE;
    reg_16 HL;
    reg_16 SP;
    reg_16 PC;
};


CPU *create_cpu(struct Gameboy *gb);

int next_op(CPU *cpu);