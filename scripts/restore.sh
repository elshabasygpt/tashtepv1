#!/bin/bash
# Tashtep v1.1 - Database Restoration Script
# Uncompresses and restores a specified .sql.gz backup file into the MySQL database.

set -e

if [ -z "$1" ]; then
  echo "Error: Missing backup file argument."
  echo "Usage: ./restore.sh /path/to/tashtep_db_YYYY-MM-DD_HH-MM-SS.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: File '$BACKUP_FILE' does not exist."
  exit 1
fi

# Extract credentials from DATABASE_URL if provided, else use defaults
if [ -z "$DATABASE_URL" ]; then
  DB_USER=${DB_USER:-"root"}
  DB_PASSWORD=${DB_PASSWORD:-"password"}
  DB_HOST=${DB_HOST:-"127.0.0.1"}
  DB_PORT=${DB_PORT:-"3306"}
  DB_NAME=${DB_NAME:-"tashtep"}
else
  DB_USER=$(echo $DATABASE_URL | sed -E 's/mysql:\/\/([^:]+).*/\1/')
  DB_PASSWORD=$(echo $DATABASE_URL | sed -E 's/mysql:\/\/[^:]+:([^@]+).*/\1/')
  DB_HOST=$(echo $DATABASE_URL | sed -E 's/.*@([^:]+).*/\1/')
  DB_PORT=$(echo $DATABASE_URL | sed -E 's/.*@[^:]+:([0-9]+)\/.*/\1/')
  DB_NAME=$(echo $DATABASE_URL | sed -E 's/.*\/([^?]+).*/\1/')
fi

echo "================================================================="
echo "WARNING: This will OVERWRITE the current database '${DB_NAME}'!"
echo "All existing data will be replaced by the contents of:"
echo "${BACKUP_FILE}"
echo "================================================================="
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restoration aborted."
  exit 1
fi

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Starting database restoration..."

# Uncompress and import
gunzip < "$BACKUP_FILE" | MYSQL_PWD="${DB_PASSWORD}" mysql -u "${DB_USER}" -h "${DB_HOST}" -P "${DB_PORT}" "${DB_NAME}"

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Database successfully restored from $BACKUP_FILE."
