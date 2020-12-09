#!/bin/bash
echo "starting james"

REMAINING_FETCHES=20
while [ ${REMAINING_FETCHES} -gt 0 ]; do
  echo "${REMAINING_FETCHES}: git fetch"
  git fetch
  if [ $? == 0 ]; then
    REMAINING_FETCHES=0
  else
    REMAINING_FETCHES=$((REMAINING_FETCHES - 1))
    sleep 5
  fi
done

git checkout origin/master
npm install
authbind --deep npm start
