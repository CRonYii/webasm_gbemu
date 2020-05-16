#pragma once

#include "gbdef.h"
#include "gameboy.h"

typedef struct CPU CPU;

struct CPU
{
    struct Gameboy *gb;
    reg_8 A;
    reg_8 F;
    reg_8 B;
    reg_8 C;
    reg_8 D;
    reg_8 E;
    reg_8 H;
    reg_8 L;
    reg_16 SP;
    reg_16 PC;
};

CPU *create_cpu(struct Gameboy *gb);

int next_op(CPU *cpu);