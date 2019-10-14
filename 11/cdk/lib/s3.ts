import cdk = require("@aws-cdk/core");
import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");

export class S3 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../build")],
      destinationBucket: websiteBucket
    });

    new cdk.CfnOutput(this, "bucketUrl", {
      description: "bucketUrl",
      value:
        "http://" +
        websiteBucket.bucketName +
        ".s3-website-us-east-1.amazonaws.com/"
    });
  }
}
