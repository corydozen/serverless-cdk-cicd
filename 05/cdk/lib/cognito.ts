import cdk = require("@aws-cdk/core");
import cognito = require("@aws-cdk/aws-cognito");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");

interface PropsFromDynamoDb {
  table: dynamodb.Table;
}

interface CognitoProps {
  dynamodb: PropsFromDynamoDb;
  stackProps: cdk.StackProps;
}

export class Cognito extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CognitoProps) {
    super(scope, id, props.stackProps);

    const userpool = new cognito.UserPool(this, `TodoUserPool`, {
      signInType: cognito.SignInType.EMAIL,
      autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL]
    });

    const cfnUserPool = userpool.node.defaultChild as cognito.CfnUserPool;

    cfnUserPool.schema = [
      {
        attributeDataType: "String",
        developerOnlyAttribute: false,
        mutable: true,
        name: "first_name",
        required: false,
        stringAttributeConstraints: {
          maxLength: "255",
          minLength: "1"
        }
      },
      {
        attributeDataType: "String",
        developerOnlyAttribute: false,
        mutable: true,
        name: "last_name",
        required: false,
        stringAttributeConstraints: {
          maxLength: "255",
          minLength: "1"
        }
      }
    ];

    cfnUserPool.policies = {
      passwordPolicy: {
        minimumLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireSymbols: false,
        requireNumbers: false,
        temporaryPasswordValidityDays: 7
      }
    };

    const cfnUserPoolClient = new cognito.CfnUserPoolClient(
      this,
      "TodoUserPoolClient",
      {
        clientName: "web",
        userPoolId: userpool.userPoolId,
        generateSecret: false
      }
    );

    const identitypool = new cognito.CfnIdentityPool(this, `TodoIdentityPool`, {
      cognitoIdentityProviders: [
        {
          providerName: cfnUserPool.attrProviderName,
          clientId: cfnUserPoolClient.ref
        }
      ],
      allowUnauthenticatedIdentities: false
    });

    const fnCreateUser = new lambda.Function(this, "TodoCreateUser", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "src/index.handler",
      code: lambda.Code.asset("./assets/lambda/createuser"),
      environment: {
        DYNAMODBTABLE: props.dynamodb.table.tableName
      },
      timeout: cdk.Duration.seconds(30)
    });

    userpool.addPostConfirmationTrigger(fnCreateUser);

    const createUserLambdaRole = fnCreateUser.role as iam.Role;

    const policyDynamoTable = new iam.Policy(this, "ToDoPolicyLambdaToDynamo", {
      policyName: "ToDoPolicyLambdaToDynamo"
    });

    const policyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [props.dynamodb.table.tableArn],
      actions: ["dynamodb:PutItem"]
    });

    policyDynamoTable.addStatements(policyStatement);

    createUserLambdaRole.attachInlinePolicy(policyDynamoTable);

    new cdk.CfnOutput(this, "userpoolid", {
      description: "userpoolid",
      value: userpool.userPoolId
    });

    new cdk.CfnOutput(this, "webclientid", {
      description: "webclientid",
      value: cfnUserPoolClient.ref
    });

    new cdk.CfnOutput(this, "identitypoolid", {
      description: "identitypoolid",
      value: identitypool.ref
    });
  }
}
