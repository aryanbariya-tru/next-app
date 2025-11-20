import { NotificationType } from "../types/notification";

export interface INotifier {
  send(message: string): string;
}

type NotifierCreator = () => INotifier;

export class NotificationFactory {
  private static registry: Record<NotificationType, NotifierCreator> = {} as any;
  
  static register(type: NotificationType, creator: NotifierCreator) {
    this.registry[type] = creator;
  }

  static create(type: NotificationType): INotifier {
    const creator = this.registry[type];
    if (!creator) {
      throw new Error(`Unknown notification type: ${type}`);
    }
    return creator();
  }
}
