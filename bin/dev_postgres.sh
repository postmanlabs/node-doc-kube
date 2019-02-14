PROJECT="caturl"

# getPort $containerName $containerPort
function getPort {
  docker inspect "$(docker ps -a --latest --filter=name=${PROJECT}_${1} -q)" --format="{{(index (index .NetworkSettings.Ports \"${2}\") 0).HostPort}}"
}

# Source development environment variables (postgres)
set -a
source .env.development.local
set +a

psql -h localhost -p "$(getPort postgres 5432/tcp)"