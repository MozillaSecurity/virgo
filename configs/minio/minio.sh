#!/usr/bin/env bash

#
# For local development and testing packaged production builds only!
#

export NODE_ENV="production"
export APP_TEST_PUBLISHER="S3"
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""

mc config host add electron-builder http://127.0.0.1:9000 $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY
mc mb electron-builder/electron-builder

rm -rf build
npm run build
npm run release macos64
