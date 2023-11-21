#!/bin/bash

# Force start from root folder
cd "$(dirname "$0")/.."

set -e

npm_server=""
npm_email=""
npm_token=""

echo "Please enter npm server (without http)"
read -r npm_server


echo "Please enter npm email"
read -r npm_email


echo "Please enter npm token"
read -r npm_token

# save npmrc configs
echo "
registry=https://registry.npmjs.com/
@strapi:registry=http://$npm_server/
email=$npm_email
always-auth=true
//$npm_server/:_auth=$npm_token
" > .npmrc

# publish packages
./node_modules/.bin/lerna publish --no-push --force-publish
