#!/bin/bash
set -e
echo '--- Component file inventory ---'
find frontend/src/components frontend/packages/ui frontend/src/features -name '*.tsx' | sort > /tmp/component_file_list.txt
echo "Found $(wc -l < /tmp/component_file_list.txt) component files"
cat /tmp/component_file_list.txt
