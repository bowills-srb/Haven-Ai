export interface SmsMessage {
  role: "user" | "assistant";
  content: string;
}

const sessions = new Map<string, SmsMessage[]>();

export function getHistory(phone: string): SmsMessage[] {
  return sessions.get(phone) ?? [];
}

export function appendHistory(phone: string, msg: SmsMessage): void {
  const hist = sessions.get(phone) ?? [];
  hist.push(msg);
  sessions.set(phone, hist);
}

export function clearHistory(phone: string): void {
  sessions.delete(phone);
}
