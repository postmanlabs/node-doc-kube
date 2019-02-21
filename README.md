Redoing [cat-url-mangler](https://github.com/loopDelicious/cat-url-mangler) in Node and deploying to kubernetes cluster.

### Pre-requisites for local development
1. Download and install [Node.js](https://nodejs.org/en/) and a package manager like [npm](https://www.npmjs.com/),
1. A persistent data store like [Postgres](https://www.postgresql.org/download/), and
1. A container platform like [Docker](https://www.docker.com/get-started).

### For Development

    npm install // install dependencies
    npm start // start app, running on 3000
    npm run start-server // start server on 5500, automatically starts postgres inside a docker container
    npm run psql // see postgres locally

### For Production

    npm run deploy // deploy to production via kubesail

For the first time deploying via kubesail, you will be prompted to answer a series of questions https://kubesail.com/blog/deploying-node-apps-the-right-way 
    
  * ? What is your application's entrypoint? src/services/server.js

### Working with docker

If you want to see your postgres container in docker, run `docker ps`. It should be named something like `caturl_postgres_1`. If you want to delete the container (and all the data in the db), stop the container with `docker stop caturl_postgres_1` and then delete the container with `docker rm caturl_postgres_1` and a new container will be created next time you start your app.
