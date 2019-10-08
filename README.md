# A Serverless Project

## Leveraging AWS to build full scale projects without having to manage any servers

This will be a series of blog posts in which I will build a serverless `todo` app, CICD'ed, ready for iterative development.

Proposed technologies:

- AWS CDK
- AWS DynamoDb
- AWS Appsync
- AWS Cognito
- AWS S3
- AWS CodeCommit
- AWS CodeBuild
- AWS CodeDeploy
- AWS CodePipeline
- ReactJS
- Redux
- React Router
- Enzyme
- Postman

I will be exploring this project as I go. So, it may not reach it's destination. But it will at least get close.

I'm going to try to avoid doing [this](https://www.youtube.com/watch?v=MAlSjtxy5ak).

# Assumptions

In this series, I'll use AWS's CDK to build out a serverless application. I will assume that the reader ...

1. understands how to develop hosted software using a frontend web client to call a backend api that uses authentication and a database
1. is not afraid of the command line
1. has a credit card (I promise you won't be charged much. Probably nothing.)

# Steps

1. [Setup CDK and CodeCommit](01/)
1. [DynamoDb](02/)
1. Cognito
1. Appsync
1. React / Redux / React Router
1. S3 Static Hosted Site
1. Enzyme testing
1. Postman

If you want to know a bit more about how I ended up here, read on. If not, go ahead and skip to [Step 1](01/).

# A Journey to Serverless

If you already understand what "serverless" means, please skip this part.

When I first started developing web applications, I had the idea that I would host my own website. I contacted my ISP and asked them to give me a static IP address (which didn't cost extra at the time). I opened up port 80 and I was off to the races. I believe it was a Windows machine, so I configured IIS to route incoming traffic to the right directory and installed php and fastcgi and voila! I had a website. I could go to 1.2.3.4 (or whatever that IP address was) and interact with the application I had built.

There were a few problems.

First, nobody else would visit the site. At least, nobody that I wanted. Of course, I needed to learn about DNS to get a domain name so that others could remember how to get to my site. But also, I needed to figure out how to guard against things like DDoS attacks and SQL Injection. Sheesh, there are some people out there who love to sow chaos.

Then the electricity would go out in the middle of the day when I'm at work. Suddenly, my site would be completely off-line. Ug. It was really becoming a pain. Why would anyone do this?

But then I learned about virtual hosting. I got an account at Dreamhost.com and followed some online tutorial of how to make that serve a website for me. This basically allowed me to rent a little piece of a computer that Dreamhost controlled. They handled things like making sure the computer always had power, and that nobody messed with the physical machine. That was super nice! I didn't have to worry about the power going out at my house any more. I still had pesky attackers, but we'll get to that later.

I decided that I wanted to host more than one project on the server that I was renting. It seemed that Dreamhost didn't want me to do that. So I eventually landed with an AWS account and used their EC2 service. It's very similar to the Dreamhost account, but with a bit more control over the environment.

Periodically, I needed to log into my EC2 instance and update the software. It seemed like there was always an update to nginx or php or mysql or something that my application was using. If I went too long without checking on it, the update list would be huge!

But anyways, I sat with my EC2 instance for a LONG time. It still hosts a bunch of tiny projects after all these years.

But then I learned about "serverless." The concept is that you just write your code or spell out your configuration, and somebody else worries about updating the underlying software. I don't have to check in to see how long my update list is any more! What's more, they have built-in tools to guard against DDoS attacks and SQL Injection and other problems that I hadn't even thought of before.

So, that's the allure of Serverless. It allows the software architect to focus on architecting software, while worrying less about maintaining the underlying scaffolding of hardware and dependency software.
