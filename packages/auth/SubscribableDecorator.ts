import { IAuthClient, IAuthState, ISubscriber, IPublisher } from "./types";
import { Publisher } from "./utils";

export interface ISubscribableAuthClient extends IAuthClient, IPublisher {}

export class SubscribableDecorator {
  public static hasConflicts(authClient: IAuthClient): boolean {
    return (
      Reflect.has(authClient, "publisher") ||
      Reflect.has(authClient, "subscribe") ||
      Reflect.has(authClient, "notify") ||
      Reflect.has(authClient, "batch")
    );
  }

  public static decorate(authClient: IAuthClient): ISubscribableAuthClient {
    const decoratedAuthClient = {
      publisher: new Publisher<IAuthState>(),
      subscribe(subscriber: ISubscriber) {
        return this.publisher.subscribe(subscriber);
      },
      notify(state: IAuthState) {
        this.publisher.notify(state);
      },
      batch(fn: () => void) {
        this.publisher.batch(fn);
      },
      setState(state: IAuthState) {
        super.setState(state);

        // @ts-ignore
        const newState = this.getState();

        this.notify(newState);
      },
      purgeState() {
        super.purgeState();

        // @ts-ignore
        const newState = this.getState();

        this.notify(newState);
      },
    };

    Object.setPrototypeOf(decoratedAuthClient, authClient);

    // @ts-ignore
    return decoratedAuthClient;
  }
}
