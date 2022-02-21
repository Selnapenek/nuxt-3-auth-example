import jwtDecode from "jwt-decode";
import { IAuthState, IAuthClient, IStorageOptions } from "../types";
import { StorageAPI } from "../utils";

interface IApiTokenAuthClientOptions {
  apiToken: string;
}

/**
 * Creates instacne of the api token auth client
 */
class ApiTokenAuthClient implements IAuthClient {
  private storageAPI: StorageAPI<IAuthState>;
  private readonly apiToken: string;

  constructor(
    options: IApiTokenAuthClientOptions,
    storageOptions: IStorageOptions<IAuthState> = {}
  ) {
    const { apiToken } = options;

    this.storageAPI = new StorageAPI<IAuthState>(
      storageOptions.storage || window.localStorage,
      storageOptions.storageKey || "auth",
      storageOptions.initialState
    );
    this.apiToken = apiToken;

    this.storageAPI.setState({ token: apiToken });
  }

  public getState(): IAuthState {
    return {
      ...this.storageAPI.getState(),
      token: this.apiToken,
    };
  }

  public getTokenInfo() {
    if (!this.apiToken) {
      return undefined;
    }

    return jwtDecode(this.apiToken) || undefined;
  }

  public setState(state: IAuthState): void {
    this.storageAPI.setState({
      ...state,
      token: this.apiToken,
    });
  }

  public purgeState(): void {
    this.storageAPI.purgeState();
    this.storageAPI.setState({ token: this.apiToken });
  }

  public checkIsAuthorized(): boolean {
    return true;
  }
}

export { ApiTokenAuthClient };
