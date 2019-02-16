PROJECT="caturl"

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
psql -h localhost -p "$(getPort postgres 5432/tcp)"