#!/usr/bin/env bash

set -euo pipefail

###############################################################################
# MySQL GTID Replication Setup Script
###############################################################################

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
    echo "[ERROR] $*" >&2
}

###############################################################################
# Required Environment Variables
###############################################################################

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is not set}"
: "${REPLICATION_USER:?REPLICATION_USER is not set}"
: "${REPLICATION_PASSWORD:?REPLICATION_PASSWORD is not set}"

: "${PRIMARY_HOST:?PRIMARY_HOST is not set}"
: "${REPLICA_HOST:?REPLICA_HOST is not set}"

REPLICATION_TIMEOUT="${REPLICATION_TIMEOUT:-60}"

###############################################################################
# Wait for MySQL
###############################################################################

wait_for_mysql() {

    local HOST="$1"
    local ELAPSED=0

    log "Waiting for MySQL server: $HOST"

    until mysqladmin \
        ping \
        -h "$HOST" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" \
        --silent
    do

        sleep 2

        ELAPSED=$((ELAPSED + 2))

        if [ "$ELAPSED" -ge "$REPLICATION_TIMEOUT" ]; then

            error "Timeout waiting for $HOST"

            exit 1

        fi

    done

    log "$HOST is ready."

}

###############################################################################
# Check Replication Status
###############################################################################

replication_running() {

    local STATUS

    STATUS=$(mysql \
        -h "$REPLICA_HOST" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" \
        -e "SHOW REPLICA STATUS\G" 2>/dev/null || true)

    echo "$STATUS" | grep -q "Replica_IO_Running: Yes" \
    && \
    echo "$STATUS" | grep -q "Replica_SQL_Running: Yes"

}

###############################################################################
# Configure Replication
###############################################################################

configure_replication() {

    log "Configuring MySQL Replication..."

    mysql \
        -h "$REPLICA_HOST" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" <<EOF

STOP REPLICA;

RESET REPLICA ALL;

CHANGE REPLICATION SOURCE TO

    SOURCE_HOST='${PRIMARY_HOST}',

    SOURCE_PORT=3306,

    SOURCE_USER='${REPLICATION_USER}',

    SOURCE_PASSWORD='${REPLICATION_PASSWORD}',

    SOURCE_AUTO_POSITION=1,

    GET_SOURCE_PUBLIC_KEY=1;

START REPLICA;

EOF

}

###############################################################################
# Verify Replication
###############################################################################

verify_replication() {

    log "Verifying replication..."

    local STATUS

    STATUS=$(mysql \
        -h "$REPLICA_HOST" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" \
        -e "SHOW REPLICA STATUS\G")

    if echo "$STATUS" | grep -q "Replica_IO_Running: Yes" \
        && \
       echo "$STATUS" | grep -q "Replica_SQL_Running: Yes"
    then

        log "Replication configured successfully."

    else

        error "Replication configuration failed."

        echo "$STATUS"

        exit 1

    fi

}

###############################################################################
# Main
###############################################################################

main() {

    log "====================================================="
    log "MySQL GTID Replication Setup"
    log "====================================================="

    wait_for_mysql "$PRIMARY_HOST"

    wait_for_mysql "$REPLICA_HOST"

    if replication_running; then

        log "Replication is already running."

        exit 0

    fi

    configure_replication

    verify_replication

    log "====================================================="
    log "Replication setup completed successfully."
    log "====================================================="

}

###############################################################################
# Execute
###############################################################################

main
