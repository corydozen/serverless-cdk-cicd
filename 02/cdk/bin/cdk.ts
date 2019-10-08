#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { DynamoDb } from "../lib/dynamodb";

const env = { region: "us-east-1" };

const app = new cdk.App();
new DynamoDb(app, "DynamoDb", { env });
