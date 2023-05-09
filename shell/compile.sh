# Create Export Folder Path
export ROOT_FOLDER=$(pwd)

# Compile
cd ./Lambda && yarn compile && cd $ROOT_FOLDER
