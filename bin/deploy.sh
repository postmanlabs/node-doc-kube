# terminate on any error
set -e

. .env

npm build

# ********* RUN TESTS *********

# run API tests against a local server, failed test(s) return a 1 (error) and terminate this script

# # [GOOD PRACTICE] run your tests against a local server
# # requires your Postman collection and environment files to be located within the project directory
# # formatted like: newman run <name-of-collection.json> -e <name-of-environment.json> --ignore-redirects
# newman run catURL.postman_collection.json -e catURL-local.postman_environment.json --ignore-redirects

# # [BETTER PRACTICE] run your tests using the Postman API (https://docs.api.getpostman.com/) to retrieve the latest versions of your collection and environment
# # requires collection UID, environment UID, and your Postman API key 
# # formatted like: newman run <authenticated-GET-collection-request> -e <authenticated-GET-environment-request> --ignore-redirects
# newman run https://api.getpostman.com/collections/1559979-96d5b0b0-5bb7-4f48-a220-b30f1eb15235?apikey=ac2c5f4081644e5aa666e151494a7992 -e https://api.getpostman.com/environments/1559979-b79220a2-959f-46f2-877c-e4024d93385?apikey=${POSTMAN_API_KEY} --ignore-redirects

# [BEST PRACTICE] run your tests against a local container that exactly replicates your production environment
# also requires collection UID, environment UID, and your Postman API key
# build and run backend on a local container on port 5501, then run tests against localhost:5501
docker build -f Dockerfile . -t backend
docker run -p 5501:5500 -d --name test_backend_run backend
# use a Postman environment switch tests over to run against container on http://localhost:5501
set +e
newman run https://api.getpostman.com/collections/1559979-96d5b0b0-5bb7-4f48-a220-b30f1eb15235?apikey=${POSTMAN_API_KEY} -e https://api.getpostman.com/environments/1559979-b79220a2-959f-46f2-877c-e4024d93385?apikey=${POSTMAN_API_KEY} --ignore-redirects
EXIT_CODE=$?
docker stop test_backend_run
docker rm test_backend_run
# # if the previous tests failed, remember to shut down the local container
if [[ $EXIT_CODE != 0 ]]; then exit $EXIT_CODE; fi
set -e


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
