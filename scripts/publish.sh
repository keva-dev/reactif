CUR_DIR=$PWD
cd $CUR_DIR/packages/core
yarn build
npm publish --access=public
