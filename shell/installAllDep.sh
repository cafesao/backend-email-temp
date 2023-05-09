# Create Export Folder Path
export ROOT_FOLDER=$(pwd)

# Install Modules (Typescript)
cd ./Lambda && yarn && cd $ROOT_FOLDER
