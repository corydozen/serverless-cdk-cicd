#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { DynamoDb } from "../lib/dynamodb";
import { Cognito } from "../lib/cognito";

const env = { region: "us-east-1" };

const app = new cdk.App();
new DynamoDb(app, "TodoDynamoDb", { env });
new Cognito(app, "TodoCognito", { env });
