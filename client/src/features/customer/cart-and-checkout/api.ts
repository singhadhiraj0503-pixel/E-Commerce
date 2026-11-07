import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  AddCustomerCartItemBody,
  AppliedPromo,
  CheckoutConfirmResponse,
  CheckoutDataResponse,
  CheckoutPayWithPointsResponse,
  CheckoutPointsResponse,
  CheckoutSessionResponse,
  CustomerCartItemIdentifier,
  CustomerCartResponse,
  SyncCustomerCartBody,
} from "./types";
import { getCustomerAddresses } from "../profile/api";

const buildCartItemUrl = (
  item: CustomerCartItemIdentifier,
  action?: "increase" | "decrease",
) => {
  const searchParams = new URLSearchParams();

  if (item.color) searchParams.set("color", item.color);
  if (item.size) searchParams.set("size", item.size);

  const query = searchParams.toString();
  const actionPath = action ? `/${action}` : "";
  const path = `/api/customer/cart/items/${item.productId}${actionPath}`;

  return query ? `${path}?${query}` : path;
};

// cart api routes

export const getCustomerCart = async () => {
  return apiGet<CustomerCartResponse>(`/api/customer/cart`);
};

export const addCustomerCartItem = async (body: AddCustomerCartItemBody) => {
  return apiPost<CustomerCartResponse, AddCustomerCartItemBody>(
    `/api/customer/cart/items`,
    body,
  );
};

export const increaseCustomerCartItem = async (
  item: CustomerCartItemIdentifier,
) => {
  return apiPatch<CustomerCartResponse>(buildCartItemUrl(item, "increase"));
};

export const decreaseCustomerCartItem = async (
  item: CustomerCartItemIdentifier,
) => {
  return apiPatch<CustomerCartResponse>(buildCartItemUrl(item, "decrease"));
};

export async function removeCustomerCartItem(item: CustomerCartItemIdentifier) {
  return apiDelete<CustomerCartResponse>(buildCartItemUrl(item));
}

export const syncCustomerCart = async (body: SyncCustomerCartBody) => {
  return apiPost<CustomerCartResponse, SyncCustomerCartBody>(
    `/api/customer/cart/sync`,
    body,
  );
};

// checkout api routes

export const getCheckoutPoints = async () => {
  return apiGet<CheckoutPointsResponse>(`/api/customer/checkout/points`);
};

export const getCheckoutData = async (): Promise<CheckoutDataResponse> => {
  const [cart, addresses, checkoutPoints] = await Promise.all([
    getCustomerCart(),
    getCustomerAddresses(),
    getCheckoutPoints(),
  ]);

  const safeCart = cart ?? { items: [], totalQuantity: 0 };
  const safeAddresseds = addresses ?? { items: [] };

  const subtotal = safeCart.items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  return {
    cart: safeCart,
    addresses: safeAddresseds,
    subtotal,
    points: checkoutPoints.points ?? 0,
  };
};

export const applyCustomerPromo = async (body: {
  code: string;
  orderValue: number;
}) => {
  return apiPost<AppliedPromo, { code: string; orderValue: number }>(
    `/api/customer/promos/apply`,
    body,
  );
};

export const createCheckoutSession = async (body: {
  addressId: string;
  promoCode?: string;
}) => {
  return apiPost<CheckoutSessionResponse, typeof body>(
    `/api/customer/checkout/create-session`,
    body,
  );
};

export const payWithPointsCheckout = async (body: {
  addressId: string;
  promoCode?: string;
}) => {
  return apiPost<CheckoutPayWithPointsResponse, typeof body>(
    `/api/customer/checkout/pay-with-points`,
    body,
  );
};

export const confirmCheckout = async (body: {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  return apiPost<CheckoutConfirmResponse, typeof body>(
    `/api/customer/checkout/confirm`,
    body,
  );
};
