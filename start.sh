#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready - running migrations..."
# Try to deploy migrations, if it fails due to existing schema, use db push instead
npx prisma migrate deploy || {
  echo "Migration deploy failed, using db push instead..."
  npx prisma db push --accept-data-loss
}

echo "Starting the application..."
exec node server.js
