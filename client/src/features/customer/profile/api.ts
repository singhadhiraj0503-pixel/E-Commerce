import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  CustomerAddressFormValues,
  CustomerAddressResponse,
} from "./types";

export const getCustomerAddresses = async () => {
  return apiGet<CustomerAddressResponse>(`/api/customer/address`);
};

export const createCustomerAddresses = async (
  body: CustomerAddressFormValues,
) => {
  return apiPost<CustomerAddressResponse, CustomerAddressFormValues>(
    `/api/customer/address`,
    body,
  );
};

export const updateCustomerAddresses = async (
  addressId: string,
  body: CustomerAddressFormValues,
) => {
  return apiPatch<CustomerAddressResponse, CustomerAddressFormValues>(
    `/api/customer/address/${addressId}`,
    body,
  );
};

export const deleteCustomerAddresses = async (addressId: string) => {
  return apiDelete<CustomerAddressResponse>(
    `/api/customer/address/${addressId}`,
  );
};
