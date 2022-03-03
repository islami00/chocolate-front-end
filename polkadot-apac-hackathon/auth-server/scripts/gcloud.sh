# If you want just tsc
# alias npm-exec='PATH=$(npm bin):$PATH'
# https://stackoverflow.com/a/55165582/16071410

# Make this generic of app name since flow is same.
npm run build
cp package.json package-lock.json db.yaml ./lib
cd lib
# build Success! We just need auth access
npm run publish-code