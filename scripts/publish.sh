#!/bin/bash

# Force start from root folder
cd "$(dirname "$0")/.."

set -e

npm_email=""
npm_token=""

echo "Please enter npm email"
read -r npm_email

echo "Please enter npm token"
read -r npm_token

# save npmrc configs
echo "
registry=https://registry.npmjs.com/
@strapi:registry=http://localhost:8081/repository/npm-internal/
email=$npm_email
always-auth=true
//localhost:8081/repository/npm-internal/:_auth=$npm_token
" > .npmrc

# publish packages
./node_modules/.bin/lerna publish --no-push --force-publish
