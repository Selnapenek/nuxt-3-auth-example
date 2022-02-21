import * as R from "ramda";

import {
  IStorage,
  IStorageAPI,
  Unsubscribe,
  ISubscriber,
  IPublisher,
} from "./types";

export class StorageAPI<T> implements IStorageAPI<T> {
  private storage: IStorage;
  private readonly storageKey: string;

  constructor(storage: IStorage, storageKey: string, initialState?: T) {
    this.storage = storage;
    this.storageKey = storageKey;

    if (!!initialState) {
      this.setState(initialState);
    }
  }

  public getState(): T {
    const auth = JSON.parse(this.storage.getItem(this.storageKey) || "{}");

    return auth || {};
  }

  public setState(newState: T): void {
    const currentState = this.getState();
    const mergedState = {
      ...currentState,
      ...newState,
    };

    this.storage.setItem(this.storageKey, JSON.stringify(mergedState));
  }

  public purgeState(): void {
    this.storage.removeItem(this.storageKey);
  }
}

export class Publisher<T> implements IPublisher {
  private subscribers: ISubscriber[];
  private inBatch: boolean;
  private pendingState: T | null;

  constructor() {
    this.subscribers = [];
    this.inBatch = false;
    this.pendingState = null;
  }

  public subscribe(subscriber: ISubscriber): Unsubscribe {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers = [...this.subscribers, subscriber];
    }

    return () => {
      const subscriberIndex = this.subscribers.indexOf(subscriber);

      if (subscriberIndex >= 0) {
        this.subscribers = R.remove(subscriberIndex, 1, this.subscribers);
      }
    };
  }

  public notify(state: T): void {
    if (this.inBatch) {
      this.pendingState = state;
      return;
    }

    this.subscribers.forEach((subscriber) => {
      subscriber(state);
    });
  }

  public batch(fn: () => void): void {
    this.inBatch = true;
    fn();
    this.inBatch = false;

    if (this.pendingState !== null) {
      this.notify(this.pendingState);
      this.pendingState = null;
    }
  }
}
