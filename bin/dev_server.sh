PROJECT="caturl"

# Ensure node dependencies
NODE_ENV="development" yarn --no-progress --no-emoji --prefer-offline

./node_modules/.bin/nodemon \
    --inspect \
    --ignore src/components \
    --ignore src/css \
    src/services/server.js
