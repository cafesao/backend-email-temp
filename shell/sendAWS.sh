# Create Export Folder Path
export ROOT_FOLDER=$(pwd)

# Install depedencies
sh ./shell/installAllDep.sh

# Compile
sh ./shell/compile.sh

# Zip Lambdas
cd ./Lambda/dist && zip -q -r ../lambda.zip ./ && echo "Success Zip Lambda" && cd $ROOT_FOLDER

# Remove node_modules and install dependencies (prod)
cd ./Lambda && rm -r node_modules && yarn --production && cd $ROOT_FOLDER

# Create folder nodejs and copy node_modules
cd ./Lambda && mkdir nodejs && mv node_modules ./nodejs || true && cd $ROOT_FOLDER

# Zip nodejs
cd ./Lambda && zip -q -r ./lib.zip ./nodejs && echo "Success Zip Lambda-Lib" && cd $ROOT_FOLDER


# Sync S3 Lambda
echo 'Sync S3'
export S3_NAME=$(aws --region us-east-1 cloudformation describe-stacks --stack-name temp-email-s3 --query "Stacks[].Outputs[?OutputKey=='S3BucketLambdaName'].OutputValue" --profile pessoal --no-cli-pager --output text)
aws s3 cp ./Lambda/lambda.zip s3://${S3_NAME}/lambda.zip --profile pessoal

# Sync S3 Lib
aws s3 cp ./Lambda/lib.zip s3://${S3_NAME}/lib.zip --profile pessoal

# Deploy Lambda
sh ./shell/deployLambda.sh

# Get Name Lambda
export LAMBDA_FUNCTION_NAME=$(aws --region us-east-1 cloudformation describe-stacks --stack-name temp-email-lambda --query "Stacks[].Outputs[?OutputKey=='LambdaName'].OutputValue" --profile pessoal --no-cli-pager --output text)

#Update Code Lambda
echo 'Update Code'
aws lambda update-function-code --function-name ${LAMBDA_FUNCTION_NAME} --s3-bucket ${S3_NAME} --s3-key lambda.zip --profile pessoal --no-cli-pager || true

# Update Lib
echo 'Create Layer'
export LAYER=$(aws lambda publish-layer-version --layer-name temp-email-layer --content S3Bucket=${S3_NAME},S3Key=lib.zip --compatible-runtimes nodejs16.x --query 'LayerVersionArn' --profile pessoal --no-cli-pager --output text || true)

# Update Layers
echo 'Update Layer'
aws lambda update-function-configuration --function-name ${LAMBDA_FUNCTION_NAME} --layers ${LAYER} --profile pessoal --no-cli-pager || true

# Clear
echo 'Clear'
sh ./shell/clearAllDep.sh
