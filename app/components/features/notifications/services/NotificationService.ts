import { NotificationFactory } from "@/app/components/features/notifications/factories/NotificationFactory";
import { NotificationType } from "@/app/components/features/notifications/types/notification";

export class NotificationService {
  static send(type: NotificationType, message: string): string {
    if (!type || !message.trim()) {
      return "⚠️ Please select a type and enter a message.";
    }
    const notifier = NotificationFactory.create(type);
    return notifier.send(message);
  }
}
