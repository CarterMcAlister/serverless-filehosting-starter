import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import getCognitoIdentityId from "./utils/getCognitoIdentityId";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(event);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: getCognitoIdentityId(event.requestContext.identity),
      uploadId: uuid.v1(),
      name: data.name,
      category: data.category,
      description: data.description,
      content: data.content,
      fileReference: data.fileReference,
      imageReference: data.imageReference,
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
