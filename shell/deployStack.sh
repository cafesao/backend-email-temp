# Create Export Folder Path
export ROOT_FOLDER=$(pwd)

echo 'Validate Templates...'

aws cloudformation validate-template --template-body file://./Devops/arn.yml \
    --profile pessoal \
    --no-cli-pager

aws cloudformation validate-template --template-body file://./Devops/s3.yml \
    --profile pessoal \
    --no-cli-pager

aws cloudformation validate-template --template-body file://./Devops/lambda.yml \
    --profile pessoal \
    --no-cli-pager

aws cloudformation validate-template --template-body file://./Devops/dynamodb.yml \
    --profile pessoal \
    --no-cli-pager

echo 'Templates Valid!'

echo 'Deploy ARN...'
aws cloudformation deploy --template-file './Devops/arn.yml' \
    --stack-name 'temp-email-arn' \
    --profile pessoal \
    --no-cli-pager \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

echo 'Deploy ARN Complete'

echo 'Deploy S3...'
aws cloudformation deploy --template-file './Devops/s3.yml' \
    --stack-name 'temp-email-s3' \
    --profile pessoal \
    --no-cli-pager \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

echo 'Deploy S3 Complete'

echo 'Deploy DynamoDB...'
aws cloudformation deploy --template-file './Devops/dynamodb.yml' \
    --stack-name 'temp-email-dynamodb' \
    --profile pessoal \
    --no-cli-pager \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

echo 'Deploy DynamoDB Complete'

echo 'Deploy Lambda...'
aws cloudformation deploy --template-file './Devops/lambda.yml' \
    --stack-name 'temp-email-lambda' \
    --profile pessoal \
    --no-cli-pager \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

echo 'Deploy Lambda Complete'
