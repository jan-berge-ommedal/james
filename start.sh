#!/bin/bash
set euxo pipefail
echo "starting james"

git fetch
git checkout origin/master
npm install
authbind --deep npm start
