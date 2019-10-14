#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { DynamoDb } from "../lib/dynamodb";
import { Cognito } from "../lib/cognito";
import { Appsync } from "../lib/appsync";
import { CognitoIam } from "../lib/cognito-iam";
import { S3 } from "../lib/s3";

import config from "../config";

const proj = config.projectname;
const env = config.environment;
const stackEnv = { region: "us-east-1" };

const app = new cdk.App();
const dynamodb = new DynamoDb(app, `${proj}${env}DynamoDb`, { stackEnv });
const cognito = new Cognito(app, `${proj}${env}Cognito`, {
  stackProps: { stackEnv },
  dynamodb
});
const appsync = new Appsync(app, `${proj}${env}Appsync`, {
  stackProps: { stackEnv },
  cognito,
  dynamodb
});
new CognitoIam(app, `${proj}${env}CognitoIam`, {
  stackProps: { stackEnv },
  appsync,
  cognito
});
new S3(app, `${proj}${env}S3`, { stackEnv });
