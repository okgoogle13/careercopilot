#!/bin/bash
# Filters out package warnings that break JSON parsing
exec 2>/dev/null
"$@" | grep -v "^An error occurred:"
