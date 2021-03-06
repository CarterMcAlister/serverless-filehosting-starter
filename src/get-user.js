import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
  const params = {
    TableName: process.env.userTableName,
    // 'Key' defines the partition key of the item to be retrieved
    // - 'userName': path parameter
    Key: {
      userName: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    console.log(result);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
