#pragma once

#include "gbdef.h"

typedef struct Joypad Joypad;

struct Joypad {

};


byte joypad_get_byte(Joypad * joypad, mem_addr address);
void joypad_set_byte(Joypad * joypad, mem_addr address, byte data);