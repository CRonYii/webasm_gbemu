#include <stdlib.h>
#include <stdio.h>
#include "cpu.h"

#define HIGH(reg) (reg >> 8)
#define LOW(reg) (reg & 0x00FF)
#define SET_HIGH(reg, byte) \
    {                       \
        reg &= 0x00FF;      \
        reg |= byte << 8;   \
    }
#define SET_LOW(reg, byte) \
    {                      \
        reg &= 0xFF00;     \
        reg |= byte;       \
    }
#define SET_FLAG(reg, bit_idx, val)         \
{                                           \
    (*reg) &= (0xFF - (1 << bit_idx));      \
    (*reg) |= val << bit_idx;               \
}
#define SET_ZERO(cpu, val) SET_FLAG(cpu, 7, val)
#define SET_SUBTRACT(cpu, val) SET_FLAG(cpu, 6, val)
#define SET_HALFCARRY(cpu, val) SET_FLAG(cpu, 5, val)
#define SET_CARRY(cpu, val) SET_FLAG(cpu, 4, val)

static void set_flag(uint8_t *reg, uint8_t bit_idx, uint8_t val);
static uint8_t get_flag(uint8_t reg, uint8_t bit_idx);
static int exec(CPU *cpu, opcode code);

CPU *create_cpu(Gameboy *gb)
{
    CPU *cpu = (CPU *)calloc(1, sizeof(CPU));
    if (!cpu)
    {
        printf("%s->%s line %d: Failed to allocate memory\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    cpu->gb = gb;
    // initialize register values
    cpu->AF = 0x01B0;
    cpu->BC = 0x0013;
    cpu->DE = 0x00D8;
    cpu->HL = 0x014D;
    cpu->SP = 0xFFFE;
    cpu->PC = 0x0100;
    return cpu;
}

static byte get_imm_byte(CPU *cpu)
{
    return mmu_get_byte(cpu->gb->mmu, cpu->PC++);
}

static word get_imm_word(CPU *cpu)
{
    return (word)get_imm_byte(cpu) + ((word)get_imm_byte(cpu) << 8);
}

int next_op(CPU *cpu)
{
    // TODO: handle interrupt
    // fetch the opcode and increment PC
    opcode code = get_imm_byte(cpu);
    return exec(cpu, code);
}

// returns the # of cpu cycles taken
static int exec(CPU *cpu, opcode code)
{
    // TODO: set flags
    MMU *mmu = cpu->gb->mmu;
    switch (code)
    {
    case 0x00: // NOP
        return 4;
    case 0x01: // LD BC,d16
        cpu->BC = get_imm_word(cpu);
        return 12;
    case 0x02: // LD (BC),A
        mmu_set_byte(mmu, cpu->BC, HIGH(cpu->AF));
        return 8;
    case 0x03: // INC BC
        cpu->BC++;
        return 4;
    case 0x04: // INC B
        cpu->BC += 0x0100;
        return 4;
    case 0x05: // DEC B
        cpu->BC -= 0x0100;
        return 4;
    case 0x06: //LD B,d8
        SET_HIGH(cpu->BC, get_imm_byte(cpu));
        return 8;
    default:
        printf("No such opcode 0x%X\n", code);
        exit(1);
    }
}