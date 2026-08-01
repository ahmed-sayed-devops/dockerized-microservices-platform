#!/usr/bin/env bash

set -euo pipefail

MYSQL1=mysql-primary
MYSQL2=mysql-replica

STATE_FILE=/state/current-primary

MYSQL_ROOT_PASSWORD=root123

REPLICATION_USER=replicator
REPLICATION_PASSWORD=replica123

CHECK_INTERVAL=2

LAST_REJOIN_TARGET=""

echo "========================================"
echo "MySQL Auto Rejoin Started"
echo "========================================"

while true
do

    CURRENT_PRIMARY=$(cat "$STATE_FILE")

    if [ "$CURRENT_PRIMARY" = "$MYSQL1" ]; then
        CURRENT_REPLICA="$MYSQL2"
    else
        CURRENT_REPLICA="$MYSQL1"
    fi

    ####################################################
    # Wait Until Replica Comes Back
    ####################################################

    if ! mysqladmin \
        ping \
        -h "$CURRENT_REPLICA" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" \
        --connect-timeout=2 \
        --silent >/dev/null 2>&1
    then

        LAST_REJOIN_TARGET=""

        sleep "$CHECK_INTERVAL"

        continue

    fi

    ####################################################
    # Check Replication Status
    ####################################################

    STATUS=$(mysql \
        -h "$CURRENT_REPLICA" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" \
        -e "SHOW REPLICA STATUS\G" 2>/dev/null || true)

    if echo "$STATUS" | grep -q "Replica_IO_Running: Yes" \
       && echo "$STATUS" | grep -q "Replica_SQL_Running: Yes"
    then

        LAST_REJOIN_TARGET="$CURRENT_REPLICA"

        sleep "$CHECK_INTERVAL"

        continue

    fi

    ####################################################
    # Don't Retry Forever
    ####################################################

    if [ "$LAST_REJOIN_TARGET" = "$CURRENT_REPLICA" ]; then

        sleep "$CHECK_INTERVAL"

        continue

    fi

    echo "[INFO] Replica detected without replication."

    echo "[INFO] Rejoining $CURRENT_REPLICA ..."

    if mysql \
        -h "$CURRENT_REPLICA" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" <<EOF
STOP REPLICA;

RESET REPLICA ALL;

SET GLOBAL super_read_only=ON;
SET GLOBAL read_only=ON;

CHANGE REPLICATION SOURCE TO
SOURCE_HOST='$CURRENT_PRIMARY',
SOURCE_USER='$REPLICATION_USER',
SOURCE_PASSWORD='$REPLICATION_PASSWORD',
SOURCE_AUTO_POSITION=1,
GET_SOURCE_PUBLIC_KEY=1;

START REPLICA;
EOF
    then

        sleep 2

        VERIFY=$(mysql \
            -h "$CURRENT_REPLICA" \
            -uroot \
            -p"$MYSQL_ROOT_PASSWORD" \
            -e "SHOW REPLICA STATUS\G" 2>/dev/null || true)

        if echo "$VERIFY" | grep -q "Replica_IO_Running: Yes" \
           && echo "$VERIFY" | grep -q "Replica_SQL_Running: Yes"
        then

            echo "[SUCCESS] Replica successfully rejoined."

            echo "[INFO] Generating HAProxy configuration..."

            bash /config/generate-config.sh
            sleep 1

            echo "[INFO] Restarting HAProxy..."

            curl --silent \
                 --unix-socket /var/run/docker.sock \
                 -X POST \
                 http://localhost/containers/docker-platform-mysql-router-1/restart >/dev/null

            echo "[SUCCESS] HAProxy restarted."

            LAST_REJOIN_TARGET="$CURRENT_REPLICA"

        else

            echo "[WARNING] Rejoin executed but replication is still unhealthy."

        fi

    else

        echo "[ERROR] Rejoin failed."

    fi

    sleep "$CHECK_INTERVAL"

done
