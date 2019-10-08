# A Serverless Project

## Step 1 - CDK and Code Commit

For step 1, we're just going to get everything set up so we can have a vessel for our project.

There is some great documentation about how to get set up here. But I'll try to boil it down.

1. [Sign up for AWS](#signup)
1. [Create an IAM user to use for this project](#iam)
1. [Install the aws-cli](#install-cli)
1. [Set up that user in your CLI](#setup-cli)
1. [Install the aws-cdk](#install-cdk)
1. [Create a CodeCommit repository](#codecommit)
1. [Create Git Credentials](#git-creds)
1. [Set up the structure for our project (or just copy the files)](#structure)
1. [Conclusion](#conclusion)

### Step 1: Sign up for AWS <a name="signup"></a>

Follow [this article](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

You'll have to put in your credit card information. But if you follow this project, you shouldn't incur any charges. If you make a mistake here or there, you could end up spending as much at \$1.00.

### Step 2: Create an IAM user to use for this project <a name="iam"></a>

Once you've signed up and logged in with your root account (that's the username/password that you used to create the account), follow these steps.

(I've added some black rectangles to hide some personal info about my account.)

1. Visit the [IAM console](https://console.aws.amazon.com/iam/home?#/users) and click on `Add User`
   ![IAM Users](../images/01_Iam_Users.png)
2. Then enter a name for the user (I chose `cdkuser`), and select both `Programmatic access` and `AWS Management Console access`. Uncheck the `User must create a new password` checkbox.
   ![Add User](../images/02_Add_User.png)
3. Click on `Attach existing policies directly` and select `Administrator Access` and then click `Next: Tags`.
   ![Add User](../images/03_Set_Permissions.png)
   WARNING - This is not `AWS Best Practices` because your user should only have access to what they need. Giving them Administrator Access means they can use any AWS service on your behalf. Technically, we should spell out each service that the user should have access to. Perhaps I'll update this later...
4. Click `Next: Review` (we don't need to add Tags).
5. Click `Create User`
6. Download the CSV
   ![Download the CSV](../images/04_Download_Csv.png)
   Your CSV should have a `password`, an `Access key ID` and a `Secret access key` and look something like this...
   ![Credentials.csv](../images/05_Credentials.png)
7. Your user has been created!

### Step 3: Install the aws-cli <a name="install-cli"></a>

Follow [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) to install the AWS CLI

### Step 4: Set up that user in your CLI <a name="setup-cli"></a>

Create a new file on your machine called `~/.aws/credentials` that has the following text...

```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

But paste in your `Access key Id` and `Secret access key` from the csv that you downloaded instead of the example keys

For more information [click here](https://docs.aws.amazon.com/en_pv/cli/latest/userguide/cli-configure-files.html#cli-configure-files-where)

### Step 5: Install the aws-cdk <a name="install-cdk"></a>

1. If you don't have it already, install [npm](https://www.npmjs.com/get-npm).
1. Then just `npm install -g aws-cdk`.
1. That's it!

Here's [more info](https://docs.aws.amazon.com/en_pv/cdk/latest/guide/getting_started.html) if you need it.

### Step 6: Create a CodeCommit repository <a name="codecommit"></a>

AWS has a service called CodeCommit. It's a lot like GitHub or GitLab.
To create a new repository...

1. Logout of the AWS Console (the AWS website).
1. Visit the `Console login link` from your `credentials.csv` file and login as the user you created in [Step 2](#iam). In my example the username will be `cdkuser`, and I'll copy the password from my `credentials.csv` file.
1. Visit [CodeCommit in the AWS Console](https://us-east-1.console.aws.amazon.com/codesuite/codecommit/repositories?region=us-east-1)
1. Click `Create repository`
   ![Create repository](../images/06_Create_Repo.png)
1. Give your repository a name (I chose `my-cdk-project`).
   ![Name your repository](../images/07_Name_Repo.png)
1. You should see something like this
   ![Repo Confirmation](../images/08_Repo_Confirmation.png)

### Step 7: Create Git Credentials <a name="git-creds"></a>

1. Go to [Users](https://console.aws.amazon.com/iam/home?region=us-east-1#/users) in the IAM Service of the AWS Console.
1. Click on the user you created (mine was `cdkuser`)
1. Click on `Security credentials`
   ![User](../images/09_User.png)
1. Scroll to the bottom and click on `Generate` under `HTTPS Git credentials for AWS CodeCommit`
   ![Security Credentials](../images/10_Security_Credentials.png)
1. Click on `Download Credentials`
   ![Generate Credentials](../images/11_Generate_Credentials.png)
1. Your csv should look something like this
   ![Downloaded Credentials](../images/12_Git_Credentials_Csv.png)

You'll need this username and password in the next step

[Here is the official AWS documentation for creating git credentials](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html?icmpid=docs_acc_console_connect_np)

### Step 8: Set up the structure for our project <a name="structure"></a>

I recommend copy-and-pasting the following blocks of code to get started. If you keep reading, you'll see why I created each of these folders and files.

#### Copy and paste

Let's say you have a folder called `projects` where you will store some... projects.

```sh
cd projects
mkdir my-cdk-project
git clone https://github.com/corydozen/serverless-cdk-cicd
cp -R serverless-cdk-cicd/01/ my-cdk-project
cd my-cdk-project
git init
git remote add origin https://git-codecommit.us-east-1.amazonaws.com/v1/repos/my-cdk-project
git add .
git commit -m "Step 1"
git push origin master
```

You'll likely be prompted for a username and password. Use the credentials from the csv that you downloaded in Step 7

This is what you just did with the copy-and-paste...

1. Clone this repo
2. Copy the `01` folder into your empty project
3. Commit the new code to your repo that you created earlier
4. Install the dependencies with `npm`

#### How I set up this project...

You don't need to do anything here. It's just an explanation of the stuff you just copied over.

These are the steps I took when building out this `01` folder.

If you don't care about this, [skip it](#conclusion)

```sh
cd 01
mkdir __testing__ build cdk public src
```

1. We will use the `__testing__` folder in [The Final Step](08/) of this tutorial to aid in the implementation of Postman testing
1. The `build` folder will contain the built assets of the front end of our application
1. The `cdk` folder will contain the code to generate our infrastructure
1. The `public` folder will hold our `index.html` file - the entry point for our front end
1. And the `src` folder will hold the source code for our front end application

```sh
echo "node_modules/" > .gitignore
npm init
npm i react react-dom react-redux react-router react-router-dom redux redux-devtools-extension redux-thunk
```

1. Establish a `.gitignore` file so that you don't commit your dependencies to your repo.
1. Initialize npm for the project
1. Install react dependencies

```sh
touch public/index.html src/App.js src/index.js src/registerServiceWorker.js
```

1. `public/index.html` is the container into which we'll inject our React project
1. `src/App.js` is the parent Component of our React project
1. `src/index.js` is the entry point of our React project
1. To learn more about what `src/registerServiceWorker.js` does, read [this](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

```sh
cd cdk
cdk init lib
```

This installs some boilerplate code for developing within the CDK. By default, it uses typescript - and that's what we'll be using in this tutorial.

### Conclusion <a name="conclusion"></a>

Yeah, there was a lot here. I hope it made sense. If not, hit me up on [twitter](https://twitter.com/murribu), or file an issue/pr on this repo.

If you made it all the way through, you're ready for [Step 2](../02)
