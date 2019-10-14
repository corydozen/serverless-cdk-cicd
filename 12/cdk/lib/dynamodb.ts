import cdk = require("@aws-cdk/core");
import dynamodb = require("@aws-cdk/aws-dynamodb");

import { config } from "../config";

const proj = config.projectname;
const env = config.environment;

export class DynamoDb extends cdk.Stack {
  public readonly table: dynamodb.Table;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, `${proj}${env}Todos`, {
      tableName: `${proj}${env}Todos`,
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING }
    });

    const readScaling = this.table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 50
    });

    const writeScaling = this.table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 50
    });

    readScaling.scaleOnUtilization({
      targetUtilizationPercent: 70
    });

    writeScaling.scaleOnUtilization({
      targetUtilizationPercent: 70
    });
  }
}
