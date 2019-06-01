import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
  const params = {
    TableName: process.env.userTableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the passed in Cognito user id
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.pathParameters.id,
    },
  };
  try {
    const result = await dynamoDbLib.call("query", params);
    if (result.Items) {
      // Return the retrieved user
      return success(result.Items[0]);
    } else {
      return failure({ status: false, error: "User not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
