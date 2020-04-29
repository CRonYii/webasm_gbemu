#pragma once

#include "gbdef.h"

typedef struct APU APU;

struct APU {

};


byte apu_get_byte(APU * apu, mem_addr address);
void apu_set_byte(APU * apu, mem_addr address, byte data);