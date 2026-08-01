#!/usr/bin/env bash

set -euo pipefail

STATE_FILE=/state/current-primary

MYSQL1=mysql-primary
MYSQL2=mysql-replica

CURRENT_PRIMARY=$(cat "$STATE_FILE")

if [ "$CURRENT_PRIMARY" = "$MYSQL1" ]; then
    CURRENT_REPLICA="$MYSQL2"
else
    CURRENT_REPLICA="$MYSQL1"
fi

cat > /config/haproxy.cfg <<EOF
global
    log stdout format raw local0

defaults
    log global
    mode tcp
    option tcplog
    timeout connect 5s
    timeout client 1m
    timeout server 1m

resolvers docker
    nameserver dns 127.0.0.11:53
    resolve_retries 3
    timeout retry 1s
    hold valid 10s

frontend mysql
    bind *:3306
    default_backend mysql_primary

backend mysql_primary
    option tcp-check

    server primary ${CURRENT_PRIMARY}:3306 \
        check inter 2s fall 2 rise 2 \
        resolvers docker init-addr libc,none

    server replica ${CURRENT_REPLICA}:3306 \
        check backup \
        resolvers docker init-addr libc,none
EOF

echo "[SUCCESS] HAProxy configuration updated."
