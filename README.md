Redoing [cat-url-mangler](https://github.com/loopDelicious/cat-url-mangler) in Node and deploying to kubernetes cluster.

### Pre-requisites for local development
1. Download and install [Node.js](https://nodejs.org/en/) and a package manager like [npm](https://www.npmjs.com/),
1. A persistent data store like [Postgres](https://www.postgresql.org/download/), and
1. A container platform like [Docker](https://www.docker.com/get-started).

### For Development

    npm install // install dependencies
    npm start // start app, running on 3000
    npm run start-server // start server on 5500, automatically starts postgres inside a docker container
    npm run psql // start postgress locally

### For Production

    npm run deploy // deploy to production via kubesail, if first time deploying via kubesail, you will be prompted to answer a series of questions https://kubesail.com/blog/deploying-node-apps-the-right-way
