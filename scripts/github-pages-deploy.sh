#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd

remote=$(git config remote.origin.url)

if [ ! -d "$1" ]
then
    echo "Usage: $0 <site source dir>"
    exit 1
fi

siteSource="$1"

if [ ! -d "$siteSource" ]
then
    echo "Directory $siteSource not found"
    exit 1
fi

# make a directory to put the gp-pages branch
mkdir gh-pages-branch
cd gh-pages-branch
# now lets setup a new repo so we can update the gh-pages branch
git config --global user.email "ci@gameoflife.xyz" > /dev/null 2>&1
git config --global user.name "CircleCI" > /dev/null 2>&1
git init
git remote add --fetch origin "$remote"

# switch into the gh-pages branch
if git rev-parse --verify origin/gh-pages-test > /dev/null 2>&1
then
    git checkout gh-pages-test
    # delete any old site as we are going to replace it
    # Note: this explodes if there aren't any, so moving it here for now
    git rm -rf .
else
    git checkout --orphan gh-pages-test
fi

# copy over or recompile the new site
la -la "../${siteSource}/."

cp -a "../${siteSource}/." .

# stage any changes and new files
git add -A
# now commit, ignoring branch gh-pages doesn't seem to work, so trying skip
git commit --allow-empty -m "Deploying build $CIRCLE_BUILD_NUM" -m "$CIRCLE_BUILD_URL"
# and push, but send any output to /dev/null to hide anything sensitive
git push --force --quiet origin gh-pages-test > /dev/null 2>&1

# go back to where we started and remove the gh-pages git repo we made and used
# for deployment
cd ..
rm -rf gh-pages-branch

echo "Finished Deployment!"
