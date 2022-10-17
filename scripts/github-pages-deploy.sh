#!/bin/sh

set -e

pwd

remote=$(git config remote.origin.url)

if [ -z "$1" ] || [ -z "$2" ]
then
    echo "Usage: $0 <site source dir>"
    exit 1
fi

siteSource="$1"
fqdn="$2"

if [ ! -d "$siteSource" ]
then
    echo "Directory $siteSource not found"
    exit 1
fi

mkdir gh-pages-branch
cd gh-pages-branch
git config --global user.email "ci@gameoflife.xyz" > /dev/null 2>&1
git config --global user.name "CircleCI" > /dev/null 2>&1
git init
git remote add --fetch origin "$remote"

if git rev-parse --verify origin/gh-pages > /dev/null 2>&1
then
    git checkout gh-pages
    git rm -rf . > /dev/null 2>&1
else
    git checkout --orphan gh-pages
fi

cp -a ../.circleci/* .circleci
cp -a "../${siteSource}/." .

echo "$fqdn" > CNAME

git add -A
git commit --allow-empty -m "[skip ci] Deploying build $CIRCLE_BUILD_URL"
git push --force --quiet origin gh-pages > /dev/null 2>&1

# clean up
cd ..
rm -rf gh-pages-branch

echo "Finished Deployment!"
