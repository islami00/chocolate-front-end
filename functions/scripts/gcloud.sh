# Success! We just need auth access
npm run build
cp package.json package-lock.json app.yaml ./lib
cd lib
# Although start won't work here, deploy to gcloud should be fine
npm run publish-code