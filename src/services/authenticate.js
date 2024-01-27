import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../userpool';

let accessToken;
let idToken;

export const authenticate = (Email, Password) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: Email,
            Pool: userpool
        });

        const authDetails = new AuthenticationDetails({
            Username: Email,
            Password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log("login successful");

                // Extract tokens from the result object
                idToken = result.idToken.jwtToken;
                accessToken = result.accessToken.jwtToken;

                // You can now use or store these tokens as needed
                // console.log("ID Token:", idToken);
                // console.log("Access Token:", accessToken);

                localStorage.setItem('jwtToken', getAccessToken());

                resolve(result);
            },
            onFailure: (err) => {
                console.log("login failed", err);
                reject(err);
            }
        });
    });
};

export const logout = () => {
    const user = userpool.getCurrentUser();
    user.signOut();
    window.location.href = '/';
};

export const getAccessToken = () => {
    return accessToken;
};