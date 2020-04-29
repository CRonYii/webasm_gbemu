#pragma once

#include "gbdef.h"
#include "gameboy.h"

#define WORK_RAM_SIZE 0x2000
#define WORK_RAM_OFFSET 0xC000
#define ECHO_RAM_OFFSET 0xE000
#define IO_REGISTERS_SEGMENT_SIZE 0x0080
#define IO_REGISTERS_SEGMENT_OFFSET 0xFF00
#define HIGH_RAM_SIZE 0x0080
#define HIGH_RAM_OFFSET 0xFF80

#define DMA_DESTINATION 0xFE00
#define DMA_RANGE 0x9F

typedef struct MMU MMU;

struct MMU
{
    struct Gameboy *gb;
    byte work_ram[WORK_RAM_SIZE];
    byte io_registers[IO_REGISTERS_SEGMENT_SIZE];
    byte hram[HIGH_RAM_SIZE];
};

MMU *create_mmu(struct Gameboy *gb);

byte mmu_get_byte(MMU *mmu, mem_addr address);

void mmu_set_byte(MMU *mmu, mem_addr address, byte data);