# exit when any command fails
set -e

if [[ -z $IDF_PATH || -z $THEME_PATH ]]; then
    echo "IDF_PATH or THEME_PATH undefined"
    exit 1;
fi;

cd ${IDF_PATH}/docs
${IDF_PATH}/tools/ci/multirun_with_pyenv.sh -p 3.6.13 build-docs -l en -t esp32s2
