# Create Export Folder Path
export ROOT_FOLDER=$(pwd)

echo $ROOT_FOLDER

# Install Modules (Typescript)

cd ./Lambda 
rm -r ./node_modules 
rm -r ./dist
rm -r *.zip*
rm -r ./nodejs
echo "Clear All Dep"
cd $ROOT_FOLDER

sh ./shell/installAllDep.sh
