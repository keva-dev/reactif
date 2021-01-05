CUR_DIR=$PWD
cd $CUR_DIR/packages/core
yarn build:dev
cd $CUR_DIR/example
yarn start