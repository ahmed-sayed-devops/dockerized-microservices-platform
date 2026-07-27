#!/bin/sh

set -e

DATE=$(date +%F_%H-%M-%S)

echo "======================================"
echo "Backup started: $(date)"

mkdir -p /backup

# Uses mysqldump from the running MySQL container
# to avoid MariaDB/MySQL client compatibility issues.

docker exec docker-platform-mysql-1 \
mysqldump \
-uroot \
-proot123 \
inventory \
| gzip > "/backup/inventory_${DATE}.sql.gz"

BACKUP_COUNT=7

ls -1t /backup/*.sql.gz 2>/dev/null \
| tail -n +$((BACKUP_COUNT + 1)) \
| xargs -r rm -f

echo "Backup completed: $(date)"
echo "======================================"
