// Base interface for common fields
interface BaseItem {
  id: string;
  location: 'S1' | 'S2' | '999';
  quantity: number;
  vendor: string;
  sku: string;
  grade: string;
  cover: string;
  description: string;
}

// Interface for items within a package
export interface PackageItem extends BaseItem {}

// Interface for individual items
export interface IndividualItem extends BaseItem {
  type: 'individual';
  salePrice: number;
  extendedPrice: number;
  deliveryDate: string;
  isAdded: boolean;
}

// Interface for package type items
export interface PackageType extends BaseItem {
  type: 'package';
  packageName: string;
  packageItems: PackageItem[];
  salePrice: number;
  extendedPrice: number;
  deliveryDate: string;
  isAdded: boolean;
}

// Union type for order details
export type OrderDetail = IndividualItem | PackageType;

export interface PhoneNumber {
  type: 'cell' | 'home' | '';
  areaCode: string;
  prefix: string;
  lineNumber: string;
}

export interface OrderForm {
  // Store Selection
  selectedStore: string;
  salespersonName: string;
  
  // Billing Information
  billingName: string;
  billingEmail: string;
  billingPhones: PhoneNumber[];
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  
  // Shipping Information
  shippingName: string;
  shippingEmail: string;
  shippingPhones: PhoneNumber[];
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  
  // Order Details
  deliveryType: 'pickup' | 'delivery';
  orderDetails: OrderDetail[];
}

export interface PhoneErrors {
  billing?: string[];
  shipping?: string[];
}

export interface EmailErrors {
  billing?: string;
  shipping?: string;
}

export interface StoreDetails {
  address: string;
  phone: string;
  fax: string;
}

export interface StoreMap {
  [key: string]: StoreDetails;
}

// Type guard to check if an OrderDetail is a PackageType
export function isPackageType(detail: OrderDetail): detail is PackageType {
  return detail.type === 'package';
}

// Constants
export const INITIAL_PHONE_STATE: PhoneNumber = {
  type: '',
  areaCode: '',
  prefix: '',
  lineNumber: ''
}; 