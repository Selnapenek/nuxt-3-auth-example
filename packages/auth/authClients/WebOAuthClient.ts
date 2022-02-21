import jwtDecode from "jwt-decode";

import { IAuthState, IAuthClient, IStorageOptions } from "../types";
import { StorageAPI } from "../utils";

interface IWebOAuthClientOptions {
  authorize: (this: WebOAuthClient, ...rest: any) => any | Promise<any>;
  logout?: (this: WebOAuthClient, ...rest: any) => any | Promise<any>;
}

/**
 * Creates instance of the web oauth client
 */
class WebOAuthClient implements IAuthClient {
  private options: IWebOAuthClientOptions;
  private storageAPI: StorageAPI<IAuthState>;

  constructor(
    options: IWebOAuthClientOptions,
    storageOptions: IStorageOptions<IAuthState> = {}
  ) {
    this.storageAPI = new StorageAPI<IAuthState>(
      storageOptions.storage || window.localStorage,
      storageOptions.storageKey || "auth",
      storageOptions.initialState
    );

    this.options = options;
  }

  public setState(state: IAuthState) {
    this.storageAPI.setState(state);
  }

  public getState(): IAuthState {
    return this.storageAPI.getState();
  }

  public purgeState() {
    this.storageAPI.purgeState();
  }

  public checkIsAuthorized() {
    const { token } = this.getState();

    return token !== "" && token !== null && token !== undefined;
  }

  public getTokenInfo() {
    const { token } = this.getState();

    if (!token) {
      return undefined;
    }

    return jwtDecode(token) || undefined;
  }

  public authorize(...args: any) {
    return this.options.authorize.apply(this, args);
  }

  public logout(...args: any) {
    if (typeof this.options.logout === "function") {
      return this.options.logout.apply(this, args);
    }
  }
}

export { WebOAuthClient };
