import { NotificationFactory } from "@/app/components/features/notifications/factories/NotificationFactory";
import {
    EmailNotifier,
    SMSNotifier,
    PushNotifier,
    CallNotifier,
    WhatsappNotifier,
    TelegramNotifier
} from "@/app/components/features/notifications/entities/notifiers/notifiers";


NotificationFactory.register("email", () => new EmailNotifier());
NotificationFactory.register("sms", () => new SMSNotifier());
NotificationFactory.register("push", () => new PushNotifier());
NotificationFactory.register("call", () => new CallNotifier());
NotificationFactory.register("whatsapp", () => new WhatsappNotifier());
NotificationFactory.register("telegram", () => new TelegramNotifier());
