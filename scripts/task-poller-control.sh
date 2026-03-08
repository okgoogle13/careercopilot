#!/bin/bash

# Antigravity Task Poller Control Script
# DEPRECATED: This script and its associated background agent are obsolete.
# Task delegation is now handled directly by the real-time model context protocol
# via the `task-router` MCP server. Do not start this daemon.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POLLER_SCRIPT="$SCRIPT_DIR/servers/antigravity_task_poller.py"
QUEUE_FILE="/tmp/kerala-rage-task-queue.json"
LAUNCHD_PLIST="$HOME/Library/LaunchAgents/com.careercopilot.task-poller.plist"
LOG_FILE="/tmp/antigravity-task-poller.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if poller script exists
check_poller_exists() {
    if [ ! -f "$POLLER_SCRIPT" ]; then
        print_error "Poller script not found: $POLLER_SCRIPT"
        exit 1
    fi
    print_success "Poller script found"
}

# Check if queue file exists
check_queue_exists() {
    if [ ! -f "$QUEUE_FILE" ]; then
        print_warning "Queue file not found: $QUEUE_FILE"
        print_info "Creating empty queue..."
        mkdir -p "$(dirname "$QUEUE_FILE")"
        cat > "$QUEUE_FILE" <<EOF
{
  "tasks": [],
  "metadata": {
    "queue_created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "total_tasks": 0,
    "pending": 0,
    "in_progress": 0,
    "completed": 0
  }
}
EOF
        print_success "Queue file created"
    else
        print_success "Queue file found"
    fi
}

# Start the poller as background process
start_foreground() {
    print_header "Starting Task Poller (Foreground)"
    check_poller_exists
    check_queue_exists

    print_info "Starting polling agent..."
    print_info "Press Ctrl+C to stop\n"

    python3 "$POLLER_SCRIPT" \
        --queue "$QUEUE_FILE" \
        --interval 30
}

# Start the poller as launchd service
start_daemon() {
    print_header "Starting Task Poller (Background Daemon)"
    check_poller_exists
    check_queue_exists

    if [ ! -f "$LAUNCHD_PLIST" ]; then
        print_error "launchd plist not found: $LAUNCHD_PLIST"
        exit 1
    fi

    print_info "Loading launchd service..."
    launchctl load "$LAUNCHD_PLIST" 2>/dev/null || launchctl unload "$LAUNCHD_PLIST" && launchctl load "$LAUNCHD_PLIST"

    sleep 2
    if launchctl list com.careercopilot.task-poller >/dev/null 2>&1; then
        print_success "Task poller daemon started"
        print_info "Log file: $LOG_FILE"
    else
        print_error "Failed to start daemon"
        exit 1
    fi
}

# Stop the daemon
stop_daemon() {
    print_header "Stopping Task Poller Daemon"

    if launchctl list com.careercopilot.task-poller >/dev/null 2>&1; then
        print_info "Stopping launchd service..."
        launchctl unload "$LAUNCHD_PLIST"
        sleep 1
        print_success "Task poller daemon stopped"
    else
        print_warning "Daemon is not running"
    fi
}

# Show daemon status
status() {
    print_header "Task Poller Status"

    if launchctl list com.careercopilot.task-poller >/dev/null 2>&1; then
        print_success "Daemon is running"
    else
        print_warning "Daemon is not running"
    fi

    if [ -f "$LOG_FILE" ]; then
        print_info "\n📊 Recent Logs (last 20 lines):"
        echo ""
        tail -20 "$LOG_FILE"
    fi

    python3 "$POLLER_SCRIPT" --queue "$QUEUE_FILE" --status
}

# List pending tasks
list_pending() {
    print_header "Pending Tasks"
    python3 "$POLLER_SCRIPT" --queue "$QUEUE_FILE" --list-pending
}

# List all tasks
list_all() {
    print_header "All Tasks"
    python3 "$POLLER_SCRIPT" --queue "$QUEUE_FILE" --list-all
}

# Watch logs in real-time
watch_logs() {
    print_header "Watching Task Poller Logs (Ctrl+C to exit)"
    if [ ! -f "$LOG_FILE" ]; then
        print_warning "Log file not created yet"
        exit 1
    fi
    tail -f "$LOG_FILE"
}

# Restart daemon
restart() {
    print_header "Restarting Task Poller Daemon"
    stop_daemon
    sleep 2
    start_daemon
    status
}

# Show help
show_help() {
    cat <<EOF
${BLUE}Antigravity Task Poller Control${NC}

Usage: $(basename "$0") <command>

Commands:
  start         Start poller in foreground (debugging)
  daemon        Start poller as background daemon
  stop          Stop the background daemon
  restart       Restart the daemon
  status        Show daemon status and recent logs
  logs          Watch logs in real-time
  pending       List pending tasks
  list          List all tasks
  help          Show this help message

Examples:
  # Start as background daemon (recommended)
  $(basename "$0") daemon

  # Check status
  $(basename "$0") status

  # Watch logs
  $(basename "$0") logs

  # Start in foreground for debugging
  $(basename "$0") start

EOF
}

# Main
case "${1:-help}" in
    start)
        start_foreground
        ;;
    daemon)
        start_daemon
        ;;
    stop)
        stop_daemon
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    logs)
        watch_logs
        ;;
    pending)
        list_pending
        ;;
    list)
        list_all
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
