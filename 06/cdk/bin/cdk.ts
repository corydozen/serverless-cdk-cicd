#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { DynamoDb } from "../lib/dynamodb";
import { Cognito } from "../lib/cognito";
import { Appsync } from "../lib/appsync";

const env = { region: "us-east-1" };

const app = new cdk.App();
const dynamodb = new DynamoDb(app, "TodoDynamoDb", { env });
const cognito = new Cognito(app, "TodoCognito", {
  stackProps: { env },
  dynamodb
});
new Appsync(app, "TodoAppsync", { stackProps: { env }, cognito, dynamodb });
