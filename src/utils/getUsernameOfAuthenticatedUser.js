const AWS = require("aws-sdk");

// Set proper region
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.region,
});

// Event object is the event passed to Lambda
export async function getUsernameOfAuthenticatedUser(event) {
  // Get the unique ID given by cognito for this user, it is passed to lambda as part of a large string in event.requestContext.identity.cognitoAuthenticationProvider
  const userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(
    ":CognitoSignIn:"
  )[1];

  const request = {
    // TODO: Fix hardcoding
    UserPoolId: "us-east-1_2iED5ewUY",
    Filter: `sub = "${userSub}"`,
    Limit: 1,
  };

  try {
    const { Users } = await cognito.listUsers(request).promise();
    return Users[0].Username;
  } catch (e) {
    return "";
  }
}
