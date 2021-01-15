CUR_DIR=$PWD
cd $CUR_DIR/packages/router
yarn build:umd
cp $CUR_DIR/packages/router/dist/ractix-router.js $CUR_DIR/test-umd/ractix-router.js

