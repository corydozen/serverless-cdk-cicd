import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle
} from "@aws-cdk/assert";
import cdk = require("@aws-cdk/core");
import DynamoDb = require("../lib/dynamodb");

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new DynamoDb.DynamoDb(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {}
      },
      MatchStyle.EXACT
    )
  );
});
