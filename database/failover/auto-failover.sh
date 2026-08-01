#!/usr/bin/env bash

set -euo pipefail

MYSQL1=mysql-primary
MYSQL2=mysql-replica

STATE_FILE=/state/current-primary

MYSQL_ROOT_PASSWORD=root123

CHECK_INTERVAL=2

PRIMARY_BACK_MESSAGE=0

echo "========================================"
echo "MySQL Auto Failover Started"
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
    # Check Current Primary
    ####################################################

    if mysqladmin \
        ping \
        -h "$CURRENT_PRIMARY" \
        -uroot \
        -p"$MYSQL_ROOT_PASSWORD" \
        --connect-timeout=2 \
        --silent >/dev/null 2>&1
    then

        if mysqladmin \
            ping \
            -h "$CURRENT_REPLICA" \
            -uroot \
            -p"$MYSQL_ROOT_PASSWORD" \
            --connect-timeout=2 \
            --silent >/dev/null 2>&1
        then

            if [ "$PRIMARY_BACK_MESSAGE" -eq 0 ]; then

                echo "[INFO] Both MySQL servers are online."
                echo "[INFO] Manual rejoin is required."

                PRIMARY_BACK_MESSAGE=1

            fi

        fi

    else

        PRIMARY_BACK_MESSAGE=0

        echo "[FAILOVER] $CURRENT_PRIMARY is DOWN."

        ####################################################
        # Check Replica Before Promotion
        ####################################################

        if ! mysqladmin \
            ping \
            -h "$CURRENT_REPLICA" \
            -uroot \
            -p"$MYSQL_ROOT_PASSWORD" \
            --connect-timeout=2 \
            --silent >/dev/null 2>&1
        then

            echo "[ERROR] Both MySQL servers are DOWN."

            sleep "$CHECK_INTERVAL"

            continue

        fi

        echo "[FAILOVER] Promoting $CURRENT_REPLICA ..."

        if mysql \
            -h "$CURRENT_REPLICA" \
            -uroot \
            -p"$MYSQL_ROOT_PASSWORD" <<EOF
STOP REPLICA;
RESET REPLICA ALL;
SET GLOBAL super_read_only=OFF;
SET GLOBAL read_only=OFF;
EOF
        then

            echo "$CURRENT_REPLICA" > "$STATE_FILE"

            echo "[INFO] Generating HAProxy configuration..."

            bash /config/generate-config.sh
            sleep 1

            echo "[INFO] Restarting HAProxy..."

            curl --silent \
                 --unix-socket /var/run/docker.sock \
                 -X POST \
                 http://localhost/containers/docker-platform-mysql-router-1/restart >/dev/null

            echo "[SUCCESS] HAProxy restarted."

            echo "[SUCCESS] $CURRENT_REPLICA promoted."

        else

            echo "[ERROR] Promotion failed."

        fi

    fi

    sleep "$CHECK_INTERVAL"

done
