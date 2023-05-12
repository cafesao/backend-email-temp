aws cloudformation validate-template --template-body file://./Devops/lambda.yml \
    --profile pessoal \
    --no-cli-pager

echo 'Deploy Lambda...'
aws cloudformation deploy --template-file './Devops/lambda.yml' \
    --stack-name 'temp-email-lambda' \
    --profile pessoal \
    --no-cli-pager \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

echo 'Deploy Lambda Complete'