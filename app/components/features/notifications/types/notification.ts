// 1. Define your valid notification types
export const NOTIFICATION_TYPES = [
  "email",
  "sms",
  "push",
  "call",
  "whatsapp",
  "telegram",
  ""
] as const;

// 2. Create a type that automatically derives from it
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
