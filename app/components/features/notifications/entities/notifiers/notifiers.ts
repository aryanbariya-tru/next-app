import { NotificationFactory, INotifier } from "@/app/components/features/notifications/factories/NotificationFactory";

export class EmailNotifier implements INotifier {
    send(message: string) {
        return `📧 Email sent: ${message}`;
    }
}
export class SMSNotifier implements INotifier {
    send(message: string) {
        return `📱 SMS sent: ${message}`;
    }
}
export class PushNotifier implements INotifier {
    send(message: string) {
        return `🔔 Push notification: ${message}`;
    }
}
export class CallNotifier implements INotifier {
    send(message: string) {
        return `Incoming Call: ${message}`;
    }
}
export class WhatsappNotifier implements INotifier {
    send(message: string) {
        return `Whatsapp Notificaiton: ${message}`;
    }
}
export class TelegramNotifier implements INotifier {
    send(message: string) {
        return `Telegram Notificaiton: ${message}`;
    }
}