import cdk = require("@aws-cdk/core");
import appsync = require("@aws-cdk/aws-appsync");
import cognito = require("@aws-cdk/aws-cognito");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import iam = require("@aws-cdk/aws-iam");
import fs = require("fs");

interface PropsFromCognito {
  userpool: cognito.UserPool;
  identitypool: cognito.CfnIdentityPool;
}

interface PropsFromDynamoDb {
  table: dynamodb.Table;
}

interface AppsyncProps {
  cognito: PropsFromCognito;
  dynamodb: PropsFromDynamoDb;
  stackProps: cdk.StackProps;
}

export class Appsync extends cdk.Stack {
  public readonly api: appsync.CfnGraphQLApi;
  constructor(scope: cdk.Construct, id: string, props: AppsyncProps) {
    super(scope, id, props.stackProps);

    this.api = new appsync.CfnGraphQLApi(this, `${proj}${env}API`, {
      authenticationType: "AMAZON_COGNITO_USER_POOLS",
      userPoolConfig: {
        awsRegion: "us-east-1",
        userPoolId: props.cognito.userpool.userPoolId,
        defaultAction: "ALLOW"
      },
      name: `${proj}${env}API`
    });

    const self = this;

    fs.readFile("./assets/appsync/schema.graphql", "utf8", function(err, data) {
      if (err) throw err;
      new appsync.CfnGraphQLSchema(self, `${proj}${env}Schema`, {
        apiId: self.api.attrApiId,
        definition: data
      });
    });

    const policyDocument = new iam.PolicyDocument();
    const policyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW
    });
    policyStatement.addActions(
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    );
    policyStatement.addResources(
      props.dynamodb.table.tableArn,
      props.dynamodb.table.tableArn + "/*"
    );
    policyDocument.addStatements(policyStatement);

    const role = new iam.Role(this, `${proj}${env}RoleAppsyncDS`, {
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
      inlinePolicies: { dynamoDSPolicyDocument: policyDocument }
    });

    const ds = new appsync.CfnDataSource(this, `${proj}${env}DataSource`, {
      apiId: this.api.attrApiId,
      name: `${proj}${env}DataSource`,
      type: "AMAZON_DYNAMODB",
      dynamoDbConfig: {
        awsRegion: "us-east-1",
        tableName: props.dynamodb.table.tableName
      },
      serviceRoleArn: role.roleArn
    });

    fs.readFile(
      "./assets/appsync/resolvers/Query.fetchMyProfile.request",
      "utf8",
      function(err, requestTemplate) {
        if (err) throw err;
        fs.readFile(
          "./assets/appsync/resolvers/Query.fetchMyProfile.response",
          "utf8",
          function(err, responseTemplate) {
            if (err) throw err;
            new appsync.CfnResolver(self, `${proj}${env}FetchMyProfile`, {
              apiId: self.api.attrApiId,
              fieldName: "fetchMyProfile",
              typeName: "Query",
              dataSourceName: ds.attrName,
              kind: "UNIT",
              requestMappingTemplate: requestTemplate,
              responseMappingTemplate: responseTemplate
            });
          }
        );
      }
    );

    new cdk.CfnOutput(this, "apiurl", {
      description: "apiurl",
      value: this.api.attrGraphQlUrl
    });
  }
}
