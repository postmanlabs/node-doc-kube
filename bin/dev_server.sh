PROJECT="caturl"

# Ensure node dependencies
NODE_ENV="development" yarn --no-progress --no-emoji --prefer-offline

# Start containerized dependencies if not running (ie postgres)
docker-compose -p ${PROJECT} up -d

# getPort $containerName $containerPort
function getPort {
  docker inspect "$(docker ps -a --latest --filter=name=${PROJECT}_${1} -q)" --format="{{(index (index .NetworkSettings.Ports \"${2}\") 0).HostPort}}"
}

# Source development environment variables (postgres)
set -a
source .env.development
set +a

DB_NAME=$POSTGRES_DB \
DB_USER=$POSTGRES_USER \
DB_PASSWORD=$POSTGRES_PASSWORD \
DB_HOST="localhost" \
DB_PORT="$(getPort postgres 5432/tcp)" \
./node_modules/.bin/nodemon \
    --inspect \
    --ignore src/components \
    --ignore src/css \
    server.js
