Redoing [cat-url-mangler](https://github.com/loopDelicious/cat-url-mangler) in Node.

### For Development

    npm start // start app, running on 3000
    npm run start-server // start server, running on 5500. Automatically starts postgres inside a docker container
    npm run psql // start postgress locally

### For Production

    npm run deploy // deploy to production via kubesail
    // If this is your first time deploying via kubesail, you will be prompted to answer a series of questions https://kubesail.com/blog/deploying-node-apps-the-right-way
