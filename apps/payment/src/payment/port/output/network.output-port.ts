export interface NetworkOuputPort {
  sendPaymentNotification(orderId: string, to: string): Promise<void>;
}
