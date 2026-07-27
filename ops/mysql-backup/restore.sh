#!/bin/sh

set -e

BACKUP_VOLUME="docker-platform_mysql-backups"
NETWORK="docker-platform_backend-net"

MYSQL_IMAGE="mysql:8.4"

MYSQL_HOST="mysql"
MYSQL_PORT="3306"

MYSQL_DATABASE="inventory"
MYSQL_USER="root"
MYSQL_PASSWORD="root123"

if [ $# -eq 0 ]; then
    echo "Usage:"
    echo "  ./restore.sh latest"
    echo "  ./restore.sh <backup-file.sql.gz>"
    exit 1
fi

FILE="$1"

if [ "$FILE" = "latest" ]; then

    FILE=$(docker run --rm \
        -v ${BACKUP_VOLUME}:/backup \
        alpine \
        sh -c "ls -t /backup/*.sql.gz | head -n1 | xargs basename")

fi

echo
echo "========================================="
echo "Backup File : $FILE"
echo "Database    : $MYSQL_DATABASE"
echo "========================================="
echo

printf "Restore this backup? (yes/no): "
read ANSWER

if [ "$ANSWER" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

docker run --rm \
    -v ${BACKUP_VOLUME}:/backup \
    --network ${NETWORK} \
    ${MYSQL_IMAGE} \
    sh -c "
        gunzip -c /backup/${FILE} | mysql \
        -h${MYSQL_HOST} \
        -P${MYSQL_PORT} \
        -u${MYSQL_USER} \
        -p${MYSQL_PASSWORD} \
        ${MYSQL_DATABASE}
    "

echo
echo "Restore completed successfully."
