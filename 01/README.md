# A Serverless Project

## Step 1 - CDK and Code Commit

For step 1, we're just going to get everything set up so we can

There is some great documentation about how to get set up here. But I'll try to boil it down.

1. [Sign up for AWS](#signup)
1. [Create an IAM user to use for this project](#iam)
1. [Install the aws-cli](#install-cli)
1. [Set up that user in your CLI](#setup-cli)
1. [Install the aws-cdk](#install-cdk)
1. [Create a CodeCommit repository](#codecommit)
1. [Set up the structure for our project (or just copy the files)](#structure)

### Sign up for AWS <a name="signup"></a>

Follow [this article](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

You'll have to put in your credit card information. But if you follow this project, you shouldn't incur any charges. If you make a mistake here or there, you could end up spending as much at \$1.00.

### Create an IAM user to use for this project <a name="iam"></a>

Once you've signed up and logged in with your root account (that's the username/password that you used to create the account), follow these steps.

(I've added some black rectangles to hide some personal info about my account.)

1. Visit the [IAM console](https://console.aws.amazon.com/iam/home?#/users) and click on `Add User`
   ![IAM Users](../images/01_Iam_Users.png)
2. Then enter a name for the user (I chose `cdkuser`), and select only `Programmatic access`
   ![Add User](../images/02_Add_User.png)
3. Click on `Attach existing policies directly` and select `Administrator Access` and then click `Next: Tags`.
   ![Add User](../images/03_Set_Permissions.png)
   WARNING - This is not `AWS Best Practices` because your user should only have access to what they need. Giving them Administrator Access means they can use any AWS service on your behalf. Technically, we should spell out each service that the user should have access to. Perhaps I'll update this later...
4. Click `Next: Review` (we don't need to add Tags).
5. Click `Create User`
6. Download the CSV
   ![Download the CSV](../images/04_Download_Csv.png)
   Your CSV should have an `Access key ID` and a `Secret access key` and look something like this...
   ![Credentials.csv](../images/05_Credentials.png)
7. Your user has been created!

### Install the aws-cli <a name="install-cli"></a>

Follow [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) to install the AWS CLI

### Set up that user in your CLI <a name="setup-cli"></a>

Refer to [this documentation](https://docs.aws.amazon.com/en_pv/cli/latest/userguide/cli-configure-files.html#cli-configure-files-where) to create a new file on your machine called `~/.aws/credentials` that has the following text...

```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

But paste in your `Access key Id` and `Secret access key` from the csv that you downloaded

### Install the aws-cdk <a name="install-cdk"></a>

1. If you don't have it already, install [npm](https://www.npmjs.com/get-npm).
1. Then just `npm install -g aws-cdk`.
1. That's it!

Here's [more info](https://docs.aws.amazon.com/en_pv/cdk/latest/guide/getting_started.html) if you need it.

### Create a CodeCommit repository <a name="codecommit"></a>

AWS has a service called CodeCommit. It's a lot like GitHub or GitLab.
To create a new repository...

1. Visit [CodeCommit in the AWS Console](https://us-east-1.console.aws.amazon.com/codesuite/codecommit/repositories?region=us-east-1)
2. Click `Create repository`
   ![Create repository](../images/06_Create_Repo.png)
3. Give your repository a name (I chose `my-cdk-project`).
   ![Name your repository](../images/07_Name_Repo.png)
4. You should see something like this
   ![Repo Confirmation](../images/08_Repo_Confirmation.png)

### Set up the structure for our project <a name="structure"></a>

Let's say you have a folder called `projects` where you will store some... projects.

```sh
cd projects
git clone https://github.com/corydozen/serverless-cdk-cicd
cp -R serverless-cdk-cicd\01\ my-cdk-project
cd my-cdk-project
git init
git remote add origin ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/my-cdk-project
git push origin master
```
