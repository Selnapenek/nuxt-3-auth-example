export type IAuthState<T extends Record<string, any> = Record<string, any>> =
  T & {
    token?: string;
  };

export interface IAuthClient<S extends IAuthState = IAuthState> {
  getState: () => S;
  setState: (state: S) => void;
  purgeState: () => void;
  checkIsAuthorized: () => boolean;
  checkIsEmailVerified?: () => boolean | void;
  getTokenInfo: () => any;
  [additionalProperty: string]: any;
}

export interface IStorage {
  getItem: (keyName: string) => string | null;
  setItem: (keyName: string, keyValue: string) => void;
  removeItem: (keyName: string) => void;
}

export interface IStorageOptions<T> {
  storage?: IStorage;
  storageKey?: string;
  initialState?: T;
}

export interface IStorageAPI<T> {
  getState(): T;
  setState(newState: T): void;
  purgeState(): void;
}

export type Unsubscribe = () => void;

export type ISubscriber = (state: any) => void;

export interface IPublisher {
  subscribe: (subscriber: ISubscriber) => Unsubscribe;
  notify: (state: any) => void;
  batch: (fn: () => void) => void;
}
