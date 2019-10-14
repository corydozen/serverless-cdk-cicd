global.fetch = require("node-fetch");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
var fs = require("fs");

var authenticationData = {
    Username: process.argv[2],
    Password: process.argv[3]
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
);
var poolData = {
    UserPoolId: process.argv[4],
    ClientId: process.argv[5]
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
    Username: process.argv[2],
    Pool: userPool
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();

        /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
        var idToken = result.idToken.jwtToken;
        var sub = result.idToken.payload.sub;
        // console.log("result", result);
        var template = fs.readFileSync(
            __dirname + "/_testing/Testing_template.postman_environment.json",
            {
                encoding: "utf-8"
            }
        );
        var json = template
            .replace("{{JWT}}", idToken)
            .replace("{{SUB}}", sub)
            .replace("{{APIURL}}", process.argv[6]);
        fs.writeFile(
            __dirname + "/_testing/Testing.postman_environment.json",
            json,
            function(err) {
                if (err) throw err;
                console.log("json file saved!");
            }
        );
    },

    onFailure: function(err) {
        console.error(err);
    }
});
