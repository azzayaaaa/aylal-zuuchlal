export const services = {
  apiGateway: process.env.API_GATEWAY_URL ?? "http://localhost:5000",
  auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:5001",
  user: process.env.USER_SERVICE_URL ?? "http://localhost:5002",
  tour: process.env.TOUR_SERVICE_URL ?? "http://localhost:5003",
  booking: process.env.BOOKING_SERVICE_URL ?? "http://localhost:5004",
  payment: process.env.PAYMENT_SERVICE_URL ?? "http://localhost:5005",
  notification: process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:5007",
};

export type GatewayBookingPayload = {
  name: string;
  phone: string;
  email?: string;
  destination: string;
  adults: number;
  children: number;
  preferredDate?: string;
  paymentMethod: string;
  budget?: string;
  message?: string;
};
