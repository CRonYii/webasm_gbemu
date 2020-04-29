#pragma once

#include "gbdef.h"

typedef struct PPU PPU;

struct PPU {

};


byte ppu_get_byte(PPU * ppu, mem_addr address);
void ppu_set_byte(PPU * ppu, mem_addr address, byte data);