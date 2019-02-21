Redoing [cat-url-mangler](https://github.com/loopDelicious/cat-url-mangler) in Node and deploying to kubernetes cluster.

### Pre-requisites for local development
1. Download and install [Node.js](https://nodejs.org/en/) and a package manager like [npm](https://www.npmjs.com/), and
1. A container platform like [Docker](https://www.docker.com/get-started).

### For Development

    npm install // install dependencies
    npm start // start app on 3000
    npm run start-server // start server on 5500

### For Production

    npm run deploy // deploy to production via kubesail

For the first time deploying via kubesail, you will be prompted to answer a series of questions https://kubesail.com/blog/deploying-node-apps-the-right-way 
    
    ? What is your application's entrypoint? e.g. src/services/server.js
    ? Which protocol does your application speak? e.g. http

