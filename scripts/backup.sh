#!/bin/bash
# Tashtep v1.1 - Database Backup Script
# Automatically dumps, compresses, and uploads the MySQL database, with a 30-day retention policy.

set -e

# Configuration
BACKUP_DIR="/var/backups/tashtep"
DATE=$(date +'%Y-%m-%d_%H-%M-%S')
FILENAME="tashtep_db_${DATE}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${FILENAME}"
RETENTION_DAYS=30

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Starting database backup..."

# Extract credentials from DATABASE_URL if provided, else use defaults
# Format: mysql://user:password@host:port/dbname
if [ -z "$DATABASE_URL" ]; then
  DB_USER=${DB_USER:-"root"}
  DB_PASSWORD=${DB_PASSWORD:-"password"}
  DB_HOST=${DB_HOST:-"127.0.0.1"}
  DB_PORT=${DB_PORT:-"3306"}
  DB_NAME=${DB_NAME:-"tashtep"}
else
  # Basic parsing (assumes strict format without special chars in password for simplicity)
  DB_USER=$(echo $DATABASE_URL | sed -E 's/mysql:\/\/([^:]+).*/\1/')
  DB_PASSWORD=$(echo $DATABASE_URL | sed -E 's/mysql:\/\/[^:]+:([^@]+).*/\1/')
  DB_HOST=$(echo $DATABASE_URL | sed -E 's/.*@([^:]+).*/\1/')
  DB_PORT=$(echo $DATABASE_URL | sed -E 's/.*@[^:]+:([0-9]+)\/.*/\1/')
  DB_NAME=$(echo $DATABASE_URL | sed -E 's/.*\/([^?]+).*/\1/')
fi

# Run mysqldump and compress on the fly
MYSQL_PWD="${DB_PASSWORD}" mysqldump -u "${DB_USER}" -h "${DB_HOST}" -P "${DB_PORT}" --single-transaction --routines --triggers "${DB_NAME}" | gzip > "$BACKUP_PATH"

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Backup successfully created: $BACKUP_PATH"

# Optional: Upload to AWS S3 (Uncomment and configure if aws-cli is installed)
if [ -n "$AWS_S3_BUCKET" ]; then
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Uploading to S3 bucket: $AWS_S3_BUCKET..."
  aws s3 cp "$BACKUP_PATH" "s3://${AWS_S3_BUCKET}/database/${FILENAME}"
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Upload complete."
fi

# Apply 30-day retention policy locally
echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Deleting local backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "tashtep_db_*.sql.gz" -mtime +$RETENTION_DAYS -exec rm -f {} \;

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Backup process finished successfully."
