export interface NetworkOuputPort {
  sendPaymentNotification(orderId: string, to: string): void;
}
