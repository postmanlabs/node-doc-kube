This project was originally published in [Deploying a scalable web application with Docker and Kubernetes](link) from the [Postman Engineering blog](https://medium.com/postman-engineering).

### Pre-requisites for local development
1. Download and install [Node.js](https://nodejs.org/en/) and a package manager like [npm](https://www.npmjs.com/), and
1. A container platform like [Docker](https://www.docker.com/get-started).

### For Development

    npm install // install dependencies
    npm start // start app on 3000
    npm run start-server // start server on 5500

### For Production

Create a new file called `.env` located in the root of your project directory, and add your production domain as shown in `.env.example`. Also add your [Postman API](https://docs.api.getpostman.com/) key if you're running Postman tests.

Update the `bin/deploy.sh` file to select a method of running your Postman tests. For the latter 2 options, you will need your collection UID and environment UID.

Run the deployment script

    npm run deploy // run API tests, then deploy frontend and backend to production 

The underlying deployment command [`npx deploy-to-kube`](https://github.com/kubesail/deploy-to-kube) will prompt you to answer [a series of questions](https://kubesail.com/blog/deploying-node-apps-the-right-way), such as:

    ? What is your application's entrypoint? e.g. src/services/server.js
    ? Which protocol does your application speak? e.g. http

I used [Kubesail](https://kubesail.com/) a hosted Kubernetes provider that offers a free managed namespace. However, [`npx deploy-to-kube`](https://github.com/kubesail/deploy-to-kube) supports any Kubernetes cluster. By running it inside your app's directory, this utility will generate a Dockerfile, build and push deployment images, generate Kubernetes configurations files, and trigger a deployment on your kubernetes cluster. 

