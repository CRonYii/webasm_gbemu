#pragma once

extern void print_error_js(char *msg);

#include <stdio.h>
static char buffer[1024] = {'\0'};

#define print_error(format, args...)   \
    {                                  \
        sprintf(buffer, format, args); \
        print_error_js(buffer);        \
    }