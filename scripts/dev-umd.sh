CUR_DIR=$PWD
cd $CUR_DIR/packages/core
yarn build:umd
cp $CUR_DIR/packages/core/dist/ractix.js $CUR_DIR/test-umd/ractix.js

