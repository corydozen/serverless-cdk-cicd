import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle
} from "@aws-cdk/assert";
import cdk = require("@aws-cdk/core");
import Cognito = require("../lib/cognito");

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Cognito.Cognito(app, "MyTestStack");
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
