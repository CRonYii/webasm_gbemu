#pragma once

#include "gbdef.h"

#define CARTRIDGE_TYPE_IDX 0x0147
#define ROM_BANKS_IDX 0X0148
#define RAM_BANKS_IDX 0X0149
#define EXTERNAL_RAM_OFFSET 0XA000

#define NO_MBC_ROM_SIZE 0x8000
#define NO_MBC_RAM_SIZE 0x2000

typedef struct Cartridge Cartridge;

struct Cartridge
{
    byte *rom;
    byte *ram;
    int rom_banks;
    int ram_banks;

    void (*set_chip_register)(Cartridge* cart, mem_addr address, byte value);
    void (*set_ram_byte)(Cartridge* cart, mem_addr address, byte value);
    byte (*get_rom_byte)(Cartridge* cart, mem_addr address);
    byte (*get_ram_byte)(Cartridge* cart, mem_addr address);
};

Cartridge *load_cartridge(byte *rom);

byte cart_get_byte(Cartridge *cart, mem_addr address);

void cart_set_byte(Cartridge *cart, mem_addr address, byte data);