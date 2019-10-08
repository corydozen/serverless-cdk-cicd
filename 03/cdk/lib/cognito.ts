import cdk = require("@aws-cdk/core");
import cognito = require("@aws-cdk/aws-cognito");

export class Cognito extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userpool = new cognito.UserPool(this, `TodoUserPool`, {
      signInType: cognito.SignInType.EMAIL,
      autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL]
    });

    const cfnUserPool = userpool.node.defaultChild as cognito.CfnUserPool;

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
  }
}
