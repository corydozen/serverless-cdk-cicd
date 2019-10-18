# A Serverless Project

## Blog Post #7 - Cognito Permissions

In order for our Cognito IdentityPool to make calls to our API, we have to give it two roles: one for authenticated calls and one for unauthenticated calls. Unfortunately, we couldn't establish these roles when we set up the IdentityPool because we didn't have our API yet. It's a chicken/egg problem.
So, the way I've resolved it is to build a second Cognito Stack that merely tacks on the two roles that our IdentityPool needs, referencing our API.

If you want to skip over the previous steps, please complete the [first step](../01). And then do the following:

```sh
cd ~/projects
rm -rf my-cdk-project/*
cp -R serverless-cdk-cicd/06/. my-cdk-project/
cd my-cdk-project/cdk/assets/lambda/create-user
npm i
cd ../../..
npm i
npm run build && cdk synth
cdk deploy Todo*
```

### Steps

1. [Import Appsync and Cognito Data](#import)
1. [Create Roles](#create-roles)
1. [Deploy](#deploy)
1. [Conclusion](#conclusion)

### Step 1: Import Appsync and Cognito Data <a name="import"></a>

I'll create a new file called [cognito-iam.ts](cdk/lib/cognito-iam.ts) and import data from the Cognito and Appsync stacks

```js
import cdk = require("@aws-cdk/core");
import cognito = require("@aws-cdk/aws-cognito");
import iam = require("@aws-cdk/aws-iam");
import appsync = require("@aws-cdk/aws-appsync");

interface PropsFromAppsync {
  api: appsync.CfnGraphQLApi;
}

interface PropsFromCognito {
  userpool: cognito.UserPool;
  identitypool: cognito.CfnIdentityPool;
}

interface CognitoIamProps {
  appsync: AppsyncProps;
  cognito: CognitoProps;
  stackProps: cdk.StackProps;
}

export class CognitoIam extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CognitoIamProps) {
    super(scope, id, props.stackProps);
  }
}
```

And create an instance of this stack in [cdk.ts](cdk/bin/cdk.ts) and feed in the appsync and cognito stacks.

```js
...
const appsync = new Appsync(app, "TodoAppsync", {
  stackProps: { env },
  cognito,
  dynamodb
});
new CognitoIam(app, "TodoCognitoIam", {
  stackProps: { env },
  appsync,
  cognito
});
```

### Step 2: Create Roles <a name="create-roles"></a>

There's a lot here, but I'm basically telling the Identity Pool that I want unauthenticated user to be able to take any cognito-sync actions (like logging in, signing up, etc). And I want authenticated user to be able to call my Appsync API.

To see it all spelled out, view the [cognito-iam.ts file](cdk/lib/cognito-iam.ts).

You'll notice that I started the `roleName`s with an `a`. This was because in the Cognito Console, it only shows a certain number of roles. If you have a bunch of roles in your account, it may not get to the `T`s and it will look like your IdentityPool doesn't have roles attached to it. :(

### Step 3: Deploy <a name="deploy"></a>

```sh
cd cdk
npm run build && cdk synth
cdk deploy Todo*
```

This should push all of your changes to your AWS environment

### Conclusion <a name="conclusion"></a>

I realize this post was basically "just copy and paste this stuff and it should work." But there is a lot of in-the-weeds IAM stuff going on here. And that is outside the scope of what I want to cover in this series.

So our infrastructure is officially built! Hooray! In the [next step](../08), we'll start building a front end for this thing.

If anything is unclear, @ me on [twitter](https://twitter.com/murribu) or file an issue/pr on this repo.
