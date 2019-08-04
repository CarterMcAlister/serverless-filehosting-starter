import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

export async function main(event, context, callback) {
  const { region, userName, request } = event
  // Combine user region and id to match userId in upload table
  const userId = `${region}:${request.userAttributes.sub}`

  const params = {
    TableName: process.env.userTableName,
    Item: {
      userName,
      userId,
      avatar: null,
      joinedOn: Date.now()
    }
  }

  try {
    await dynamoDbLib.call('put', params)
    callback(null, event)
  } catch (e) {
    console.error(e)
    callback(null, event)
  }
}
