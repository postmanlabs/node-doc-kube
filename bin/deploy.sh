# terminate on any error
set -e

. .env.local

npm build

# ********* RUN TESTS *********

# run API tests, failed test(s) return a 1 (error)
# this is running tests against local server
# newman run collection.json -e environment.json
# newman run https://api.getpostman.com/collections/1559979-96d5b0b0-5bb7-4f48-a220-b30f1eb15235?apikey=ac2c5f4081644e5aa666e151494a7992 -e ENV-request


# build and run backend on container with identical dependencies
# spin up local container running on port 5501
# run tests against localhost:5501
docker build -f Dockerfile.backend . -t backend
docker stop test_backend_run
docker rm test_backend_run
docker run -p 5501:5500 -d --name test_backend_run backend
# newman run Postman\ Echo.postman_collection.json
docker stop test_backend_run
# {{https://localhost:5501}}
# newman run https://api.getpostman.com/collections/1559979-96d5b0b0-5bb7-4f48-a220-b30f1eb15235?apikey=${POSTMAN_API_KEY}

# ********* DEPLOY TO PRODUCTION *********

# git revision
GIT_REV=$(git rev-parse --short HEAD)

# build docker container for front end, and tag container name
docker build -f Dockerfile.ui . -t joycelin1600/cat-ui:${GIT_REV} -t joycelin1600/cat-ui:prod

docker push joycelin1600/cat-ui:${GIT_REV}

# tell kubernetes to use newest UI image
kubectl set image deployment/cat-ui cat-ui=joycelin1600/cat-ui:${GIT_REV}

# deploy backend to kubernetes
npx deploy-to-kube
