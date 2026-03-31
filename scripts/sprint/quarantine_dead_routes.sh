#!/bin/bash
set -e
mkdir -p _quarantine/pages _quarantine/kr
echo '--- Quarantine dry-run. Pass --execute to move files. ---'
if [ "$1" == "--execute" ]; then
  echo 'EXECUTING quarantine — Claude Code populates mv commands from orphans.json'
else
  echo 'DRY RUN. Review orphans.json entries before passing --execute.'
  cat docs/manifests/orphans.json | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); JSON.parse(d).forEach(o=>console.log('Would quarantine:', o.path))"
fi
