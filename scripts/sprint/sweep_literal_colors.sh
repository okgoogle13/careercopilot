#!/bin/bash
echo '--- Scanning for literal Tailwind palette classes ---'
grep -rn --include='*.tsx' --include='*.ts' \
  -E '(bg|text|border|ring|fill|stroke)-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+' \
  frontend/src/ | grep -v '_quarantine' | grep -v '.test.' | sort > /tmp/literal_class_hits.txt
echo "Found $(wc -l < /tmp/literal_class_hits.txt) literal class instances"
cat /tmp/literal_class_hits.txt
