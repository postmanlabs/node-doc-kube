# JOYCE DELETE THIS FILE ~/.kube/config THEN re run deploy.sh

# terminate on any error
set -e

. .env

npm run build

# ********* RUN TESTS *********

# run API tests against a local server, failed test(s) return a 1 (error) and terminate this script
# if you don't plan to run any Postman tests, ensure this entire section is commented out

# # [GOOD PRACTICE] run your tests against a local server
# # requires your Postman collection and environment files to be located within the project directory
# # formatted like: newman run <name-of-collection.json> -e <name-of-environment.json> --ignore-redirects
# newman run catURL.postman_collection.json -e catURL-local.postman_environment.json --ignore-redirects

# # [BETTER PRACTICE] run your tests using the Postman API (https://docs.api.getpostman.com/) to retrieve the latest versions of your collection and environment
# # requires collection UID, environment UID, and your Postman API key 
# # formatted like: newman run <authenticated-GET-collection-request> -e <authenticated-GET-environment-request> --ignore-redirects
# newman run https://api.getpostman.com/collections/1559645-9f5aa83b-666d-41ef-9b91-6c3ec25ef789?apikey=ac2c5f4081644e5aa666e151494a7992 -e https://api.getpostman.com/environments/1559645-b5c093e1-bf72-4f7e-b18a-11263f21ec32?apikey=${POSTMAN_API_KEY} --ignore-redirects

# [BEST PRACTICE] run your tests against a local container that exactly replicates your production environment
# also requires collection UID, environment UID, and your Postman API key
# build and run backend on a local container on port 5501, then run tests against localhost:5501
docker build -f Dockerfile . -t backend
docker run -p 5501:5500 -d --name test_backend_run backend
# use a Postman environment switch tests over to run against container on http://localhost:5501
set +e
newman run https://api.getpostman.com/collections/1559645-9f5aa83b-666d-41ef-9b91-6c3ec25ef789?apikey=${POSTMAN_API_KEY} -e https://api.getpostman.com/environments/1559645-b5c093e1-bf72-4f7e-b18a-11263f21ec32?apikey=${POSTMAN_API_KEY} --ignore-redirects
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
docker build -f Dockerfile.ui . -t ${DOCKER_HUB_USERNAME}/cat-ui:${GIT_REV} -t ${DOCKER_HUB_USERNAME}/cat-ui:prod
docker push ${DOCKER_HUB_USERNAME}/cat-ui:${GIT_REV}

# deploy backend to kubernetes
# will look for a kube config, and if none exists prompt to set up via kubesail
npx deploy-to-kube --no-confirm

# deploy frontend and tell kubernetes to use newest UI image
kubectl apply -f deployment-ui-prod.yaml
kubectl set image deployment/cat-ui cat-ui=${DOCKER_HUB_USERNAME}/cat-ui:${GIT_REV}
