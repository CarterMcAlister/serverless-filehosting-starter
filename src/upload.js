import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import getCognitoIdentityId from "./utils/getCognitoIdentityId";
import { getUsernameOfAuthenticatedUser } from "./utils/getUsernameOfAuthenticatedUser";

const formatName = string => string.replace(/[^a-z0-9_-]/gi, "-").toLowerCase();

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const userName = await getUsernameOfAuthenticatedUser(event);

  const params = {
    TableName: process.env.tableName,
    Item: {
      userName,
      uploadId: formatName(data.name),
      userId: getCognitoIdentityId(event.requestContext.identity),
      name: data.name,
      category: data.category,
      description: data.description,
      content: data.content,
      fileReference: data.fileReference,
      imageReference: data.imageReference,
      createdAt: Date.now(),
      GsiHash: "Item"
    }
  };
  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
