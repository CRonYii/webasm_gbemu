#include <stdlib.h>
#include <stdio.h>
#include "mmu.h"

const byte BIOS[] = {
    //  X0    X1    X2    X3    X4    X5    X6    X7    X8    X9    XA    XB    XC    XD    XE    XF
    0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E, // 0X
    0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0, // 1X
    0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B, // 2X
    0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9, // 3X
    0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20, // 4X
    0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04, // 5X
    0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2, // 6X
    0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06, // 7X
    0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xF2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20, // 8X
    0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17, // 9X
    0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, // AX
    0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, // BX
    0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, // CX
    0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3c, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x4C, // DX
    0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20, // EX
    0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50, // FX
};

MMU *create_mmu(struct Gameboy *gb)
{
    MMU *mmu = calloc(1, sizeof(MMU));
    if (!mmu)
    {
        printf("%s->%s line %d: Failed to allocate memory\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    mmu->gb = gb;
    return mmu;
}

void DMA(MMU *mmu, byte src)
{
    if (src > 0xf1)
    {
        printf("Invalid DMA transfer request: %.4x\n", src);
        exit(1);
    }
    mem_addr offset = (mem_addr)src << 8;
    for (mem_addr i = 0; i <= DMA_RANGE; i++)
    {
        byte val = mmu_get_byte(mmu, offset + i);
        mmu_set_byte(mmu, DMA_DESTINATION + i, val);
    }
}

byte mmu_get_byte(MMU *mmu, mem_addr address)
{
    if (address <= 0x7FFF)
        return cart_get_byte(mmu->gb->cart, address); // cartridge ROM
    switch (address & 0xF000)
    {
    case 0x8000:
    case 0x9000:
        return ppu_get_byte(mmu->gb->ppu, address); // PPU's Video RAM
    case 0xA000:
    case 0xB000:
        return cart_get_byte(mmu->gb->cart, address); // External RAM from cartridge
    case 0xC000:
    case 0xD000:
        return mmu->work_ram[address - WORK_RAM_OFFSET]; // Work RAM
    case 0xE000:
        return mmu->work_ram[address - ECHO_RAM_OFFSET]; // Echo RAM - typically not used
    case 0xF000:
        if ((address & 0x0FFF) <= 0xDFF)
            return mmu->work_ram[address - ECHO_RAM_OFFSET]; // Echo RAM - typically not used
        switch (address & 0x0F00)
        {
        case 0xE00:
            if ((address & 0x00FF) <= 0x9F)
                return ppu_get_byte(mmu->gb->ppu, address); // PPU's OAM
            else
                return 0xFF; // unusable memory, always return 0xFF
        case 0xF00:
            if ((address & 0x00FF) <= 0x7F)
            {
                if (address >= 0xff10 && address <= 0xff3f)
                    return apu_get_byte(mmu->gb->apu, address); // APU IO Registers
                if (address >= 0xff04 && address <= 0xff07)
                    return gbtimer_get_byte(mmu->gb->gbtimer, address); // Timer IO Registers
                if (address >= 0xff40 && address <= 0xff4B)
                    return ppu_get_byte(mmu->gb->ppu, address); // PPU's IO Registers
                switch (address)
                {
                case 0xff00:
                    return joypad_get_byte(mmu->gb->joypad, address); // Joypad IO Registers
                case 0xff0f:
                    return mmu->gb->interrupt_flags; // Interrupt Flags
                case 0xff46:
                    return 0x00; // DMA, not readable
                }
                return mmu->io_registers[address - IO_REGISTERS_SEGMENT_OFFSET]; //  Miscellaneous IO Registers
            }
            else
            {
                if (address == 0xffff)
                    return mmu->gb->interrupt_enable;        // Interrupt Enable
                return mmu->hram[address - HIGH_RAM_OFFSET]; // High RAM
            }
        }
    default:
        printf("Address not implemented 0x%x\n", address);
        exit(1);
    }
}

void mmu_set_byte(MMU *mmu, mem_addr address, byte data)
{
    if (address <= 0x7FFF)
        return cart_set_byte(mmu->gb->cart, address, data); // cartridge ROM
    switch (address & 0xF000)
    {
    case 0x8000:
    case 0x9000:
        return ppu_set_byte(mmu->gb->ppu, address, data); // PPU's Video RAM
    case 0xA000:
    case 0xB000:
        return cart_set_byte(mmu->gb->cart, address, data); // External RAM from cartridge
    case 0xC000:
    case 0xD000:
        mmu->work_ram[address - WORK_RAM_OFFSET] = data; // Work RAM
        return;
    case 0xE000:
        mmu->work_ram[address - ECHO_RAM_OFFSET] = data; // Echo RAM - typically not used
        return;
    case 0xF000:
        if ((address & 0x0FFF) <= 0xDFF)
        {
            mmu->work_ram[address - ECHO_RAM_OFFSET] = data; // Echo RAM - typically not used
            return;
        }
        switch (address & 0x0F00)
        {
        case 0xE00:
            if ((address & 0x00FF) <= 0x9F)
                return ppu_set_byte(mmu->gb->ppu, address, data); // PPU's OAM
            else
                return; // unusable memory
        case 0xF00:
            if ((address & 0x00FF) <= 0x7F)
            {
                if (address >= 0xff10 && address <= 0xff3f)
                    return apu_set_byte(mmu->gb->apu, address, data); // APU IO Registers
                if (address >= 0xff04 && address <= 0xff07)
                    return gbtimer_set_byte(mmu->gb->gbtimer, address, data); // Timer IO Registers
                if (address >= 0xff40 && address <= 0xff4B)
                    return ppu_set_byte(mmu->gb->ppu, address, data); // PPU's IO Registers
                switch (address)
                {
                case 0xff00:
                    return joypad_set_byte(mmu->gb->joypad, address, data); // Joypad IO Registers
                case 0xff0f:
                    mmu->gb->interrupt_flags = data; // Interrupt Flags
                    return;
                case 0xff46:
                    return DMA(mmu, data);
                }
                mmu->io_registers[address - IO_REGISTERS_SEGMENT_OFFSET] = data; //  Miscellaneous IO Registers
                return;
            }
            else
            {
                if (address == 0xffff)
                {
                    mmu->gb->interrupt_enable = data; // Interrupt Enable
                    return;
                }
                mmu->hram[address - HIGH_RAM_OFFSET] = data; // High RAM
                return;
            }
        }
    default:
        printf("Address not implemented 0x%x\n", address);
        exit(1);
    }
}