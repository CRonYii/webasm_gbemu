#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "gbdef.h"
#include "cartridge.h"
#include "jslib.h"

Cartridge *create_no_mbc_cartridge(byte *rom);

int get_rom_banks(byte *rom)
{
    byte val = rom[ROM_BANKS_IDX];
    if (val == 0x0)
        return 2;
    if (val == 0x1)
        return 4;
    if (val == 0x2)
        return 8;
    if (val == 0x3)
        return 16;
    if (val == 0x4)
        return 32;
    if (val == 0x5)
        return 64;
    if (val == 0x6)
        return 128;
    if (val == 0x7)
        return 256;
    if (val == 0x8)
        return 512;
    if (val == 0x52)
        return 72;
    if (val == 0x53)
        return 80;
    if (val == 0x54)
        return 96;
    print_error("Unsupported ROM Banks #: %.4x\n", val);
    exit(1);
}

int get_ram_banks(byte *rom)
{
    byte val = rom[RAM_BANKS_IDX];
    if (val == 0x0)
        return 0;
    if (val == 0x1)
        return 1;
    if (val == 0x2)
        return 1;
    if (val == 0x3)
        return 4;
    if (val == 0x4)
        return 16;
    if (val == 0x5)
        return 8;
    print_error("Unsupported RAM Banks #: %.4x\n", val);
    exit(1);
}

Cartridge *load_cartridge(byte *rom)
{
    switch (rom[CARTRIDGE_TYPE_IDX])
    {
    case 0x00:
        return create_no_mbc_cartridge(rom);
    case 0x01:
    case 0x02:
    case 0x03:
        // TODO: MBC1
    default:
        print_error("Unsupported Cartridge: %.4x\n", rom[CARTRIDGE_TYPE_IDX]);
        exit(1);
    }
}

void free_cartridge(Cartridge *cart) {
    free(cart->rom);
    free(cart->ram);
    free(cart);
}

byte cart_get_byte(Cartridge *cart, mem_addr address)
{
    if (address <= 0x7FFF)
    {
        return cart->get_rom_byte(cart, address);
    }
    else if (cart->ram_banks > 0)
    {
        return cart->get_ram_byte(cart, address);
    }
    return 0xFF;
}

void cart_set_byte(Cartridge *cart, mem_addr address, byte data)
{
    if (address <= 0x7FFF)
    {
        cart->set_chip_register(cart, address, data);
    }
    else if (cart->ram_banks > 0)
    {
        cart->set_ram_byte(cart, address, data);
    }
}

void no_mbc_set_chip_register(Cartridge *cart, mem_addr address, byte value)
{
    // No MBC chip, cannot write to cartridge
}
void no_mbc_set_ram_byte(Cartridge *cart, mem_addr address, byte value)
{
    cart->ram[address - EXTERNAL_RAM_OFFSET] = value;
}
byte no_mbc_get_rom_byte(Cartridge *cart, mem_addr address)
{
    return cart->rom[address];
}
byte no_mbc_get_ram_byte(Cartridge *cart, mem_addr address)
{
    return cart->ram[address - EXTERNAL_RAM_OFFSET];
}

Cartridge *create_no_mbc_cartridge(byte *rom)
{
    Cartridge *cart = calloc(1, sizeof(Cartridge));
    if (!cart)
    {
        print_error("%s->%s line %d: Failed to allocate memory\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    cart->rom_banks = get_rom_banks(rom);
    cart->ram_banks = get_ram_banks(rom);
    cart->rom = calloc(NO_MBC_ROM_SIZE, sizeof(byte));
    cart->ram = calloc(NO_MBC_RAM_SIZE, sizeof(byte));
    memcpy(cart->rom, rom, NO_MBC_ROM_SIZE);
    cart->set_chip_register = no_mbc_set_chip_register;
    cart->set_ram_byte = no_mbc_set_ram_byte;
    cart->get_rom_byte = no_mbc_get_rom_byte;
    cart->get_ram_byte = no_mbc_get_ram_byte;
    return cart;
}