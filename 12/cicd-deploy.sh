#!/bin/bash
cd cdk/assets/lambda/createuser
npm i
cd ../../..
cdk list
npm i
npm run build && cdk synth
cdk deploy TodosTestingCognito --require-approval never &> ../cdkdeployresult_cognito.txt
wait $!
cdk deploy TodosTestingAppsync --require-approval never &> ../cdkdeployresult_appsync.txt
wait $!
cdk deploy TodosTestingCognitoIam --require-approval never
cd ..
echo "export default {};" > src/config.ts
node parseAwsOutputs.js src/config.js
chmod +x setAwsResourcesEnvVars.sh
. ./setAwsResourcesEnvVars.sh
aws cognito-idp sign-up --region us-east-1 --client-id $WEBCLIENTID --username admin@example.com --password Passw0rd!  --user-attributes '[{"Name":"custom:first_name","Value":"Admin"},{"Name":"custom:last_name","Value":"Istrator"},{"Name":"custom:organization","Value":"Example"}]'
aws cognito-idp admin-confirm-sign-up --region us-east-1 --user-pool-id $USERPOOLID --username admin@example.com
npm i
node getUserJwt.js admin@example.com Passw0rd! $USERPOOLID $WEBCLIENTID $APIURL
wait $!