import * as lambda from "aws-lambda";
import * as AWS from "aws-sdk";

exports.handler = async (event: any, serverlessContext: lambda.Context) => {
  const dynamoClient = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  const date = new Date();
  const dateAsIso = date.toISOString();
  const TableName: string = process.env.DYNAMODBTABLE || "";
  const ConditionExpression = "attribute_not_exists(PK)";
  try {
    const Item = {
      PK: { S: "user" + event.request.userAttributes["sub"] },
      SK: { S: "user" + dateAsIso },
      firstName: event.request.userAttributes["custom:first_name"],
      lastName: event.request.userAttributes["custom:last_name"],
      organization: event.request.userAttributes["custom:organization"],
      email: event.request.userAttributes["email"]
    };
    const data = await dynamoClient.transactWriteItems({
      TransactItems: [{ Put: { Item, TableName, ConditionExpression } }]
    });
  } catch (error) {
    console.log({ statusCode: 400, error });
  }

  return event;
};
