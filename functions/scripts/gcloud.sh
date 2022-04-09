# Success! We just need auth access
npm run build
cp package.json package-lock.json app.yaml ./lib
cd lib
# DEPLOY TO gcloud moved to workflow step.