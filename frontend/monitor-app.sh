#!/bin/bash

# CareerCopilot Application Monitor
# Monitors the development server and logs any issues

LOGFILE="/Applications/careercopilot/frontend/logs/app-monitor.log"
APP_URL="http://localhost:5173"
CHECK_INTERVAL=30

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOGFILE")"

echo "=== CareerCopilot Monitor Started $(date) ===" >> "$LOGFILE"

while true; do
    # Check if server is responding
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null)
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "[$TIMESTAMP] ✅ Server OK (HTTP $HTTP_CODE)" >> "$LOGFILE"

        # Check if specific routes are accessible
        ROUTES=("/documents" "/analysis" "/applications")
        for route in "${ROUTES[@]}"; do
            ROUTE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL$route" 2>/dev/null)
            if [ "$ROUTE_CODE" = "200" ]; then
                echo "[$TIMESTAMP] ✅ Route $route OK" >> "$LOGFILE"
            else
                echo "[$TIMESTAMP] ❌ Route $route failed (HTTP $ROUTE_CODE)" >> "$LOGFILE"
            fi
        done
    else
        echo "[$TIMESTAMP] ❌ Server error (HTTP $HTTP_CODE)" >> "$LOGFILE"
    fi

    # Check for any npm processes
    NPM_PROCESSES=$(ps aux | grep "[n]pm run dev" | wc -l)
    echo "[$TIMESTAMP] 📊 NPM processes: $NPM_PROCESSES" >> "$LOGFILE"

    # Show recent log tail if there are issues
    if [ "$HTTP_CODE" != "200" ] || [ "$NPM_PROCESSES" -eq "0" ]; then
        echo "[$TIMESTAMP] 📝 Recent dev server logs:" >> "$LOGFILE"
        tail -5 /Applications/careercopilot/frontend/logs/dev-server.log >> "$LOGFILE" 2>/dev/null
    fi

    sleep "$CHECK_INTERVAL"
done
