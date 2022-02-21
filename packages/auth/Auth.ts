import { IAuthClient, IStorage } from "./types";
import { WebAuth0AuthClient } from "./authClients/WebAuth0AuthClient";
import { WebNativeAuthClient } from "./authClients/WebNativeAuthClient";
import { WebCognitoAuthClient } from "./authClients/WebCognitoAuthClient";
import { WebOAuthClient } from "./authClients/WebOAuthClient";
import { ApiTokenAuthClient } from "./authClients/ApiTokenAuthClient";

import { AUTH_STRATEGIES } from "./constants";
import { SubscribableDecorator } from "./SubscribableDecorator";

interface IAuthClientCreateOptions {
  strategy: AUTH_STRATEGIES | string;
  storageOptions?: {
    storage?: IStorage;
    storageKey?: string;
    initialState?: Object;
  };
  subscribable?: boolean;
}

const getAuthClientConstructor = (strategy: AUTH_STRATEGIES | string): any => {
  switch (strategy) {
    case AUTH_STRATEGIES.API_TOKEN: {
      return ApiTokenAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE:
    case AUTH_STRATEGIES.WEB_8BASE_AUTH0:
    case AUTH_STRATEGIES.WEB_AUTH0: {
      return WebAuth0AuthClient;
    }
    case AUTH_STRATEGIES.WEB_OAUTH: {
      return WebOAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE_COGNITO:
    case AUTH_STRATEGIES.WEB_COGNITO: {
      return WebCognitoAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE_NATIVE: {
      return WebNativeAuthClient;
    }
  }
};

export class Auth {
  public static createClient(
    options: IAuthClientCreateOptions,
    clientOptions: any
  ): IAuthClient {
    const { strategy, subscribable } = options;

    const storageOptions = !!options.storageOptions
      ? options.storageOptions
      : {
          // @ts-ignore
          storage: options.storage,
          // @ts-ignore
          storageKey: options.storageKey,
        };

    const Constructor = getAuthClientConstructor(strategy);

    let authClient: IAuthClient = new Constructor(
      clientOptions,
      storageOptions
    );

    if (subscribable) {
      authClient = SubscribableDecorator.decorate(authClient);
    }

    return authClient;
  }
}
