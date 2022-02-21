# 8base SDK - Auth Module
The 8base SDK provides an easy way to implement authentication in your client application. Whether you're using 8base Authentication, Auth0, or an OpenID provider, the `Auth` module helps in managing the authentication flow.

For further information regarding Auth, please [refer to the docs](https://docs.8base.com/development-tools/sdk/auth).

## Parameters

-   `strategy` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Auth strategy.
-   `storageOptions`
    -   `storage`  Kind of storage for auth(window.localStorage by default)
    -   `storageKey` Key to save auth data (`auth` by default)
    -   `initialState` Initial auth state
-   `subscribable` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolena)** Is auth client should be subscribable


## Usage
The `Auth` module exposes several different auth strategies. These can be declared as strings or imported from the SDK as `AUTH_STRATEGIES`. The `Auth.createClient` function accepts two configuration objects, from which it generates the an `authClient` that is instantiated per the given strategy.

Some required values include the following:


## Auth Strategies
There are currently several different available auth strategies that the SDK supports. They are:

```javascript
AUTH_STRATEGIES {
  WEB_8BASE_AUTH0 = "web_8base_auth0",
  WEB_8BASE_NATIVE = "web_8base_native",
  WEB_8BASE_COGNITO = "web_8base_cognito",
  WEB_AUTH0 = "web_auth0",
  WEB_COGNITO = "web_cognito",
  WEB_OAUTH = "web_oauth",
  API_TOKEN = "api_token",
}
```

##### `WEB_AUTH0` Example
To initialize a new `authClient` using the `WEB_8BASE` or `WEB_AUTH0` strategy, refer to the following configuration.

`domain`, `clientId`, `logoutUrl`, `redirectUri` can be collected from an [Authentication Profile](https://docs.8base.com/8base-console/authentication#authorization) created in the 8base management console.


```javascript
import { Auth, AUTH_STRATEGIES } from "@8base/auth";
/**
 * Creating an Authentication Profile in 8base will provide
 * you with a Client ID and Domain.
 */
const domain = 'authentication-profile.auth.domain';
const clientId = 'authentication-profile-client-id';
/**
 * The redirect and logout URIs are all configured in the
 * authentication profile that gets set up in the 8base
 * management console.
 */
const logoutRedirectUri = `${window.location.origin}/logout`;
const redirectUri = `${window.location.origin}/auth/callback`;
/**
 * There are multiple auth strategies that can be
 * used when using 8base. By default, specifying
 * 'web_8base' will configure the 8base auth client.
 */
const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES['STRATEGY_NAME']
  },
  {
    domain,
    clientId,
    redirectUri,
    logoutRedirectUri
  }
);
```

##### `API_TOKEN` Example
To initialize a new `authClient` using the `API_TOKEN` strategy, refer to the following configuration.

```javascript
import { Auth } from "@8base/auth";
/**
 * Set the API token generated in 8base management console.
 */
const apiToken = "8base-api-token";
/**
 * Specify the strategy and API token.
 */
export default Auth.createClient(
  {
    strategy: "api_token"
  },
  {
    apiToken
  }
);
```


##### `WEB_OAUTH` Firebase Example
```js
import firebase from 'firebase';
import { Auth } from "@8base/auth";

const FIREBASE_CONFIGURATION = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const firebaseAuth = firebase.initializeApp(FIREBASE_CONFIGURATION).auth();

export default Auth.createClient(
  {
    strategy: "web-oauth"
  },
  {
    authorize (email, password) {
      return firebaseAuth.signInWithEmailAndPassword(
        email,
        password,
      )
        .then(() => firebaseAuth.currentUser.getIdToken())
        .then((token) => {
          return token;
        })
      },
    logout() {
      window.addEventListener('unload', () => {
        this.purgeState();
      });

      window.location.href = '/';
    }
  }
);

```
