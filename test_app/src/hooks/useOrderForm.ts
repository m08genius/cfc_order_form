import { useState } from 'react';
import { 
  OrderForm, 
  PhoneErrors, 
  EmailErrors, 
  PhoneNumber, 
  OrderDetail,
  PackageType,
  IndividualItem,
  isPackageType,
  INITIAL_PHONE_STATE
} from '../types';

const INITIAL_ORDER_DETAIL: IndividualItem = {
  id: crypto.randomUUID(),
  type: 'individual',
  location: 'S1',
  quantity: 1,
  vendor: '',
  sku: '',
  grade: '',
  cover: '',
  description: '',
  salePrice: 0,
  extendedPrice: 0,
  isAdded: false
};

const INITIAL_FORM_STATE: OrderForm = {
  selectedStore: '',
  salespersonName: '',
  billingName: '',
  billingEmail: '',
  billingPhones: [INITIAL_PHONE_STATE],
  billingAddress: '',
  billingCity: '',
  billingState: '',
  billingZipCode: '',
  shippingName: '',
  shippingEmail: '',
  shippingPhones: [INITIAL_PHONE_STATE],
  shippingAddress: '',
  shippingCity: '',
  shippingState: '',
  shippingZipCode: '',
  deliveryType: 'pickup',
  orderDetails: [INITIAL_ORDER_DETAIL],
  deliveryDate: '',
  carePlan: 'no'
};

export function useOrderForm() {
  const [formData, setFormData] = useState<OrderForm>(INITIAL_FORM_STATE);
  const [phoneError, setPhoneError] = useState<PhoneErrors>({});
  const [phoneTypeError, setPhoneTypeError] = useState<PhoneErrors>({});
  const [emailError, setEmailError] = useState<EmailErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && name === 'sameAsBilling') {
      if ((e.target as HTMLInputElement).checked) {
        copyBillingToShipping();
      } else {
        clearShippingInfo();
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'billingEmail' || name === 'shippingEmail') {
      validateEmailField(name, value);
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingName: prev.billingName,
      shippingEmail: prev.billingEmail,
      shippingAddress: prev.billingAddress,
      shippingCity: prev.billingCity,
      shippingState: prev.billingState,
      shippingZipCode: prev.billingZipCode,
      shippingPhones: prev.billingPhones.map(phone => ({ ...phone }))
    }));
  };

  const clearShippingInfo = () => {
    setFormData(prev => ({
      ...prev,
      shippingName: '',
      shippingEmail: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZipCode: '',
      shippingPhones: [INITIAL_PHONE_STATE]
    }));
  };

  const validateEmailField = (field: string, value: string) => {
    const isValid = validateEmail(value);
    setEmailError(prev => ({
      ...prev,
      [field]: isValid ? undefined : 'Please enter a valid email address (e.g., example@domain.com)'
    }));
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'billing' | 'shipping',
    index: number,
    part: 'areaCode' | 'prefix' | 'lineNumber'
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = part === 'areaCode' ? 3 : part === 'prefix' ? 3 : 4;
    
    if (value.length <= maxLength) {
      updatePhoneNumber(type, index, part, value);
      validatePhoneNumber(type, index);
    }
  };

  const updatePhoneNumber = (
    type: 'billing' | 'shipping',
    index: number,
    part: keyof PhoneNumber,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Phones`]: (prev[`${type}Phones`] as PhoneNumber[]).map((phone: PhoneNumber, i: number) => 
        i === index ? { ...phone, [part]: value } : phone
      )
    }));
  };

  const validatePhoneNumber = (type: 'billing' | 'shipping', index: number) => {
    const phones = formData[`${type}Phones`];
    const currentPhone = phones[index];
    const completeNumber = `${currentPhone.areaCode}${currentPhone.prefix}${currentPhone.lineNumber}`;
    
    setPhoneError(prev => ({
      ...prev,
      [type]: prev[type]?.map((error, i) => 
        i === index 
          ? (completeNumber.length === 10 ? undefined : 'Please enter a complete 10-digit phone number')
          : error
      )
    }));
  };

  const handlePackageModeToggle = () => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === 0 ? (
          detail.type === 'individual' 
            ? {
                ...detail,
                type: 'package' as const,
                packageName: '',
                packageItems: []
              } as PackageType
            : {
                ...detail,
                type: 'individual' as const,
              } as IndividualItem
        ) : detail
      )
    }));
  };

  const handleOrderDetailChange = (index: number, field: keyof OrderDetail, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const addOrderDetail = () => {
    const currentItem = formData.orderDetails[0];
    
    if (!validateOrderDetail(currentItem)) {
      return;
    }

    setFormData(prev => {
      const newOrderDetails: OrderDetail[] = [
        prev.orderDetails[0],
        ...prev.orderDetails.filter(detail => detail.isAdded),
        { ...currentItem, isAdded: true }
      ];

      newOrderDetails[0] = { ...INITIAL_ORDER_DETAIL };

      return {
        ...prev,
        orderDetails: newOrderDetails
      };
    });
  };

  const validateOrderDetail = (detail: OrderDetail): boolean => {
    if (isPackageType(detail)) {
      if (!detail.packageName) {
        alert('Please enter a package name');
        return false;
      }
      if (!detail.packageItems?.length) {
        alert('Please add at least one item to the package');
        return false;
      }
      if (!detail.packageItems.every(item => item.vendor && item.sku && item.description)) {
        alert('Please fill in all required fields for each package item');
        return false;
      }
    } else {
      if (!detail.vendor || !detail.sku || !detail.description) {
        alert('Please fill in all required fields');
        return false;
      }
    }
    return true;
  };

  return {
    formData,
    phoneError,
    phoneTypeError,
    emailError,
    handleChange,
    handlePhoneChange,
    handlePackageModeToggle,
    handleOrderDetailChange,
    addOrderDetail,
    validateOrderDetail,
    setFormData,
    setPhoneError,
    setPhoneTypeError,
    setEmailError
  };
} 