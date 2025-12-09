#!/usr/bin/env bash
echo "=== CPU / MEM (htop snapshot) ==="
top -b -n1 | head -n 15

echo -e "\n=== Memory & Swap ==="
free -h

echo -e "\n=== Disk usage ==="
df -h /

echo -e "\n=== I/O stats (last 5 sec) ==="
if command -v iostat >/dev/null; then
    iostat -xz 1 5 | tail -n +2 | head -n 5
else
    echo "iostat not found (sysstat package missing)"
fi

echo -e "\n=== Top 5 memory‑hungry processes ==="
ps -eo pid,comm,%mem,%cpu --sort=-%mem | head -n 6

echo -e "\n=== Running services that often cause slowdown ==="
systemctl list-units --type=service --state=running | grep -iE 'snap|tracker|apt|cron'
