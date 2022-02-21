import { GraphQLClient, gql } from "graphql-request";
import jwtDecode from "jwt-decode";
import * as R from "ramda";

import { IAuthState, IAuthClient, IStorageOptions } from "../types";
import { StorageAPI } from "../utils";

export interface IWebNativeAuthClientOptions {
  authProfileId: string;
  apiEndpoint: string;
}

type IWebNativeAuthState = IAuthState<{
  refreshToken: string;
}>;

const isEmptyOrNil = R.either(R.isNil, R.isEmpty);

const USER_LOGIN_MUTATION = gql`
  mutation Login($data: UserLoginInput!) {
    userLogin(data: $data) {
      success
      auth {
        idToken
        refreshToken
      }
    }
  }
`;

const USER_SINGUP_MUTATION = gql`
  mutation SingUp(
    $authProfileId: ID
    $password: String!
    $user: UserCreateInput!
  ) {
    userSignUpWithPassword(
      authProfileId: $authProfileId
      password: $password
      user: $user
    ) {
      id
    }
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($data: RefreshTokenInput!) {
    userRefreshToken(data: $data) {
      refreshToken
      idToken
    }
  }
`;

/**
 * Creates instance of the web native auth client.
 */
class WebNativeAuthClient implements IAuthClient<IWebNativeAuthState> {
  private readonly authProfileId: string;

  private storageAPI: StorageAPI<IWebNativeAuthState>;

  private graphQLClient: GraphQLClient;

  constructor(
    options: IWebNativeAuthClientOptions,
    storageOptions: IStorageOptions<IWebNativeAuthState> = {}
  ) {
    const { authProfileId, apiEndpoint } = options;

    this.storageAPI = new StorageAPI<IWebNativeAuthState>(
      storageOptions.storage || window.localStorage,
      storageOptions.storageKey || "auth",
      storageOptions.initialState
    );

    this.authProfileId = authProfileId;
    this.graphQLClient = new GraphQLClient(apiEndpoint);
  }

  public setState(state: IWebNativeAuthState): void {
    this.storageAPI.setState(state);
  }

  public getState(): IWebNativeAuthState {
    return this.storageAPI.getState();
  }

  public getTokenInfo(): unknown {
    const { token } = this.storageAPI.getState();

    if (!token) {
      return undefined;
    }

    try {
      return jwtDecode(token || "") || undefined;
    } catch (err) {
      return undefined;
    }
  }

  public purgeState(): void {
    this.storageAPI.purgeState();
  }

  public checkIsAuthorized(): boolean {
    const { token } = this.getState();

    return R.not(isEmptyOrNil(token));
  }

  public async singUp({
    user,
    password,
  }: {
    user: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    password: string;
  }): Promise<{ success: boolean }> {
    await this.graphQLClient.request(USER_SINGUP_MUTATION, {
      user,
      password,
      authProfileId: this.authProfileId,
    });

    const { userLogin } = await this.graphQLClient.request(
      USER_LOGIN_MUTATION,
      {
        data: {
          email: user.email,
          password,
          authProfileId: this.authProfileId,
        },
      }
    );

    if (userLogin.success) {
      this.setState({
        token: userLogin.auth.idToken,
        refreshToken: userLogin.auth.refreshToken,
      });
    }

    return { success: userLogin.success || false };
  }

  public async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ success: boolean }> {
    const { userLogin } = await this.graphQLClient.request(
      USER_LOGIN_MUTATION,
      {
        data: {
          email,
          password,
          authProfileId: this.authProfileId,
        },
      }
    );

    if (userLogin.success) {
      this.setState({
        token: userLogin.auth.idToken,
        refreshToken: userLogin.auth.refreshToken,
      });
    }

    return { success: userLogin.success || false };
  }

  public async refreshToken(): Promise<void> {
    const { refreshToken } = this.getState();
    const { userRefreshToken } = await this.graphQLClient.request(
      REFRESH_TOKEN_MUTATION,
      {
        data: {
          refreshToken,
          authProfileId: this.authProfileId,
        },
      }
    );

    this.setState({
      token: userRefreshToken.idToken,
      refreshToken: userRefreshToken.refreshToken,
    });
  }

  public logout(): void {
    this.purgeState();
  }
}

export { WebNativeAuthClient };
