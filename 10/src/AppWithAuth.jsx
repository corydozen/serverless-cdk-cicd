import React from "react";
import {
  ConfirmSignIn,
  RequireNewPassword,
  ForgotPassword,
  Greetings,
  TOTPSetup,
  Loading,
  withAuthenticator
} from "aws-amplify-react";
import Amplify from "aws-amplify";
import App from "./App";
import MySignUp from "./components/authentication/MySignUp";
import MySignIn from "./components/authentication/MySignIn";
import { UsernameAttributes } from "aws-amplify-react/dist/Auth/common/types";

import { default as config } from "./config";

Amplify.configure({
  Auth: {
    identityPoolId: config.aws.identitypoolid,
    region: config.aws.cognitoregion,
    userPoolId: config.aws.userpoolid,
    userPoolWebClientId: config.aws.webclientid
  },
  API: {
    aws_appsync_graphqlEndpoint: config.aws.apiurl,
    aws_appsync_region: "us-east-1",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
  },
  aws_appsync_graphqlEndpoint: config.aws.apiurl,
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
});

// Amplify.Logger.LOG_LEVEL = "DEBUG";

const customAuthComponents = [
  <MySignUp
    override="SignUp"
    signUpConfig={{
      hiddenDefaults: ["phone_number", "username"],
      signUpFields: [
        {
          label: "Email",
          key: "email",
          required: true,
          displayOrder: 1,
          type: "string"
        },
        {
          label: "Password",
          key: "password",
          required: true,
          displayOrder: 2,
          type: "password"
        },
        {
          label: "First Name",
          key: "first_name",
          required: true,
          displayOrder: 3,
          type: "string",
          custom: true
        },
        {
          label: "Last Name",
          key: "last_name",
          required: true,
          displayOrder: 3,
          type: "string",
          custom: true
        }
      ]
    }}
  />,
  <MySignIn
    override={"SignIn"}
    usernameAttributes={[UsernameAttributes.EMAIL]}
  />,
  <Greetings />,
  <ConfirmSignIn />,
  <RequireNewPassword />,
  <ForgotPassword />,
  <TOTPSetup />,
  <Loading />
];

export default withAuthenticator(
  App, // the component we want rendered after auth flow
  true, // set to false to hide default greeting header component
  customAuthComponents, // our custom auth components for use w/ amplify Authenticator
  null, // federated auth settings. we don't use so false
  {}, // empty theme object to avoid default amplify styles
  null // signUpConfig
);
