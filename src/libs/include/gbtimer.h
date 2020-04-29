#pragma once

#include "gbdef.h"

typedef struct GBTimer GBTimer;

struct GBTimer {

};


byte gbtimer_get_byte(GBTimer * gbtimer, mem_addr address);
void gbtimer_set_byte(GBTimer * gbtimer, mem_addr address, byte data);