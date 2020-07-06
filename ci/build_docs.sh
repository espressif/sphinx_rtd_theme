# exit when any command fails
set -e

if [[ -z $IDF_PATH || -z $THEME_PATH ]]; then
    echo "IDF_PATH or THEME_PATH undefined"
    exit 1;
fi;

# Make sure we are building docs with the new theme version
VER=`python3 $THEME_PATH/setup.py --version`
sed -i "s/^sphinx_idf_theme==.*/sphinx_idf_theme==$VER/" $IDF_PATH/docs/requirements.txt

cd ${IDF_PATH}/docs
${IDF_PATH}/tools/ci/multirun_with_pyenv.sh -p 3.6.10 pip install -r requirements.txt
${IDF_PATH}/tools/ci/multirun_with_pyenv.sh -p 3.6.10 ./build_docs.py -l en -t esp32s2 build