PROJECT="caturl"

# Ensure node dependencies
NODE_ENV="development" yarn --no-progress --no-emoji --prefer-offline

# Start containerized dependencies if not running (ie postgres)
docker-compose -p ${PROJECT} up -d

# getPort $containerName $containerPort
function getPort {
  docker inspect "$(docker ps -a --latest --filter=name=${PROJECT}_postgres_${1} -q)" --format="{{(index (index .NetworkSettings.Ports \"${2}\") 0).HostPort}}"
}

# Source development environment variables (postgres)
set -a
source .env.development.local
set +a

PGDATABASE=$POSTGRES_DB \
PGUSER=$POSTGRES_USER \
PGPASSWORD=$POSTGRES_PASSWORD \
PGHOST="localhost" \
PGPORT="$(getPort postgres 5432/tcp)" \
./node_modules/.bin/nodemon \
    --inspect \
    --ignore src/components \
    --ignore src/css \
    src/services/server.js
