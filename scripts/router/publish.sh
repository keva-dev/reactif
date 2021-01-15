CUR_DIR=$PWD
cd $CUR_DIR/packages/router
yarn build
npm publish --access=public
