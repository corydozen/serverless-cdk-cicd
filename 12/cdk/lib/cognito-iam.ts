import cdk = require("@aws-cdk/core");
import cognito = require("@aws-cdk/aws-cognito");
import iam = require("@aws-cdk/aws-iam");
import appsync = require("@aws-cdk/aws-appsync");

import { config } from "../config";

const proj = config.projectname;
const env = config.environment;

interface PropsFromAppsync {
  api: appsync.CfnGraphQLApi;
}

interface PropsFromCognito {
  userpool: cognito.UserPool;
  identitypool: cognito.CfnIdentityPool;
}

interface CognitoIamProps {
  appsync: PropsFromAppsync;
  cognito: PropsFromCognito;
  stackProps: cdk.StackProps;
}

export class CognitoIam extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CognitoIamProps) {
    super(scope, id, props.stackProps);

    const unauthPolicyDocument = new iam.PolicyDocument();

    const unauthPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW
    });

    unauthPolicyStatement.addActions("cognito-sync:*");

    unauthPolicyStatement.addResources("*");
    unauthPolicyDocument.addStatements(unauthPolicyStatement);

    const cognitoAuthPolicyDocument = new iam.PolicyDocument();

    const cognitoAuthPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW
    });

    cognitoAuthPolicyStatement.addActions(
      "cognito-sync:*",
      "cognito-identity:*"
    );

    cognitoAuthPolicyStatement.addResources("*");
    cognitoAuthPolicyDocument.addStatements(cognitoAuthPolicyStatement);

    const appsyncAuthPolicyDocument = new iam.PolicyDocument();
    const appsyncAuthPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW
    });

    appsyncAuthPolicyStatement.addActions("appsync:GraphQL");
    appsyncAuthPolicyStatement.addResources(
      props.appsync.api.attrArn,
      "arn:aws:appsync:*:*:apis/*/types/*/fields/*"
    );
    cognitoAuthPolicyDocument.addStatements(appsyncAuthPolicyStatement);

    const unauthRole = new iam.Role(this, `${proj}${env}UnauthRole`, {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": props.cognito.identitypool.ref
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated"
          }
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      roleName: `a${proj}${env}UnauthRole`,
      inlinePolicies: {
        unauthPolicyDocument: unauthPolicyDocument
      }
    });

    const authRole = new iam.Role(this, `${proj}${env}AuthRole`, {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": props.cognito.identitypool.ref
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated"
          }
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      roleName: `a${proj}${env}AuthRole`,
      inlinePolicies: {
        cognitoAuthPolicyDocument: cognitoAuthPolicyDocument
      }
    });

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      `${proj}${env}RoleAttachment`,
      {
        identityPoolId: props.cognito.identitypool.ref,
        roles: {
          unauthenticated: unauthRole.roleArn,
          authenticated: authRole.roleArn
        }
      }
    );
  }
}
