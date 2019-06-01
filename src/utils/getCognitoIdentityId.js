export default function getCognitoIdentityId({
  cognitoAuthenticationProvider,
  cognitoIdentityId,
}) {
  const userSubId = cognitoAuthenticationProvider.split(":CognitoSignIn:")[1];
  const userRegion = cognitoIdentityId.split(":")[0];

  return `${userRegion}:${userSubId}`;
}
