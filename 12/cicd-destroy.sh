#!/bin/bash
cd cdk
echo "y" | cdk destroy TodosTesting*
# cdk doesn't actually delete the table
aws dynamodb delete-table --table-name TodosTestingTodos
