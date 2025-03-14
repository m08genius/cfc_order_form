import React, { useState } from 'react';
import './App.css';

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
interface PackageItem extends BaseItem {}

// Interface for individual items
interface IndividualItem extends BaseItem {
  type: 'individual';
  salePrice: number;
  extendedPrice: number;
  deliveryDate: string;
  isAdded: boolean;
}

// Interface for package type items
interface PackageType extends BaseItem {
  type: 'package';
  packageName: string;
  packageItems: PackageItem[];
  salePrice: number;
  extendedPrice: number;
  deliveryDate: string;
  isAdded: boolean;
}

// Union type for order details
type OrderDetail = IndividualItem | PackageType;

interface PhoneNumber {
  type: 'cell' | 'home' | '';
  areaCode: string;
  prefix: string;
  lineNumber: string;
}

interface OrderForm {
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

interface PhoneErrors {
  billing?: string[];
  shipping?: string[];
}

interface EmailErrors {
  billing?: string;
  shipping?: string;
}

// Type guard to check if an OrderDetail is a PackageType
function isPackageType(detail: OrderDetail): detail is PackageType {
  return detail.type === 'package';
}

function App() {
  const [formData, setFormData] = useState<OrderForm>({
    // Store Selection
    selectedStore: '',
    salespersonName: '',
    
    // Billing Information
    billingName: '',
    billingEmail: '',
    billingPhones: [{ type: '', areaCode: '', prefix: '', lineNumber: '' }],
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    
    // Shipping Information
    shippingName: '',
    shippingEmail: '',
    shippingPhones: [{ type: '', areaCode: '', prefix: '', lineNumber: '' }],
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    
    // Order Details
    deliveryType: 'pickup',
    orderDetails: [{
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
      deliveryDate: '',
      isAdded: false
    } as IndividualItem]
  });

  const [phoneError, setPhoneError] = useState<PhoneErrors>({});
  const [phoneTypeError, setPhoneTypeError] = useState<PhoneErrors>({});
  const [emailError, setEmailError] = useState<EmailErrors>({});

  const storeDetails = {
    'Arden, NC': {
      address: '100 Airport Rd. Arden, NC 28704',
      phone: '828-681-5011',
      fax: '828-681-5022'
    },
    'Waynesville, NC': {
      address: '121 Eagles Nest Rd, Waynesville, NC 28786',
      phone: '828-454-9293',
      fax: '828-681-5022'
    }
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
      const phones = formData[`${type}Phones` as keyof OrderForm] as PhoneNumber[];
      setFormData(prev => ({
        ...prev,
        [`${type}Phones`]: phones.map((phone, i) => 
          i === index ? { ...phone, [part]: value } : phone
        )
      }));

      // Validate complete phone number
      const currentPhone = phones[index];
      const completeNumber = `${currentPhone.areaCode}${currentPhone.prefix}${currentPhone.lineNumber}`;
      
      if (completeNumber.length === 10) {
        setPhoneError(prev => ({
          ...prev,
          [type]: prev[type]?.map((error, i) => 
            i === index ? undefined : error
          )
        }));
      } else if (completeNumber.length > 0) {
        setPhoneError(prev => ({
          ...prev,
          [type]: prev[type]?.map((error, i) => 
            i === index ? 'Please enter a complete 10-digit phone number' : error
          )
        }));
      }
    }
  };

  const addPhoneNumber = (type: 'billing' | 'shipping') => {
    const phones = formData[`${type}Phones` as keyof OrderForm] as PhoneNumber[];
    
    // Check if any existing phone number is incomplete
    const hasIncompletePhone = phones.some(phone => {
      const completeNumber = `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
      return completeNumber.length > 0 && completeNumber.length !== 10;
    });

    if (hasIncompletePhone) {
      setPhoneError(prev => ({
        ...prev,
        [type]: prev[type]?.map((error, i) => 
          error || 'Please complete the current phone number before adding another one'
        )
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [`${type}Phones`]: [...phones, { type: '', areaCode: '', prefix: '', lineNumber: '' }]
    }));
  };

  const removePhoneNumber = (type: 'billing' | 'shipping', index: number) => {
    const phones = formData[`${type}Phones` as keyof OrderForm] as PhoneNumber[];
    setFormData(prev => ({
      ...prev,
      [`${type}Phones`]: phones.filter((_, i) => i !== index)
    }));
    // Remove error for the deleted phone number
    setPhoneError(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index)
    }));
    setPhoneTypeError(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneTypeChange = (type: 'billing' | 'shipping', index: number, value: string) => {
    const phones = formData[`${type}Phones` as keyof OrderForm] as PhoneNumber[];
    
    // Check if any other phone number is incomplete before allowing type change
    const hasIncompletePhone = phones.some((phone, i) => {
      if (i !== index) {
        const completeNumber = `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
        return completeNumber.length > 0 && completeNumber.length !== 10;
      }
      return false;
    });

    if (hasIncompletePhone) {
      setPhoneError(prev => ({
        ...prev,
        [type]: prev[type]?.map((error, i) => 
          error || 'Please complete the current phone number before modifying another one'
        )
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [`${type}Phones`]: phones.map((phone, i) => 
        i === index ? { ...phone, type: value as 'cell' | 'home' | '' } : phone
      )
    }));
    // Clear error for this specific phone number
    setPhoneTypeError(prev => ({
      ...prev,
      [type]: prev[type]?.map((error, i) => 
        i === index ? undefined : error
      )
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && name === 'sameAsBilling') {
      if ((e.target as HTMLInputElement).checked) {
        // Copy billing information to shipping
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
      } else {
        // Clear shipping information
        setFormData(prev => ({
          ...prev,
          shippingName: '',
          shippingEmail: '',
          shippingAddress: '',
          shippingCity: '',
          shippingState: '',
          shippingZipCode: '',
          shippingPhones: [{ type: '', areaCode: '', prefix: '', lineNumber: '' }]
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate email when changed
    if (name === 'billingEmail' || name === 'shippingEmail') {
      const isValid = validateEmail(value);
      setEmailError(prev => ({
        ...prev,
        [name]: isValid ? undefined : 'Please enter a valid email address (e.g., example@domain.com)'
      }));
    }
  };

  const handleOrderDetailChange = (index: number, field: keyof OrderDetail, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
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

  const handlePackageItemChange = (itemId: string, field: keyof PackageItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === 0 && isPackageType(detail) ? {
          ...detail,
          packageItems: detail.packageItems.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        } : detail
      )
    }));
  };

  const addPackageItem = () => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === 0 && isPackageType(detail) ? {
          ...detail,
          packageItems: [
            ...detail.packageItems,
            {
              id: crypto.randomUUID(),
              location: 'S1',
              quantity: 1,
              vendor: '',
              sku: '',
              grade: '',
              cover: '',
              description: ''
            }
          ]
        } : detail
      )
    }));
  };

  const removePackageItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === 0 && isPackageType(detail) ? {
          ...detail,
          packageItems: detail.packageItems.filter(item => item.id !== itemId)
        } : detail
      )
    }));
  };

  const addOrderDetail = () => {
    const currentItem = formData.orderDetails[0];
    
    // Validate based on type
    if (currentItem.type === 'package') {
      if (!currentItem.packageName) {
        alert('Please enter a package name');
        return;
      }
      if (!currentItem.packageItems?.length) {
        alert('Please add at least one item to the package');
        return;
      }
      if (!currentItem.packageItems.every(item => item.vendor && item.sku && item.description)) {
        alert('Please fill in all required fields for each package item');
        return;
      }
    } else {
      if (!currentItem.vendor || !currentItem.sku || !currentItem.description) {
        alert('Please fill in all required fields');
        return;
      }
    }

    // Add the current item to the summary
    setFormData(prev => {
      const newOrderDetails: OrderDetail[] = [
        // Keep the current form (first item) unchanged
        prev.orderDetails[0],
        // Add any previously added items
        ...prev.orderDetails.filter(detail => detail.isAdded)
      ];

      // Add the current item
      newOrderDetails.push({ ...currentItem, isAdded: true });

      // Reset the form fields while keeping the delivery date
      const deliveryDate = prev.orderDetails[0].deliveryDate;
      newOrderDetails[0] = {
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
        deliveryDate: deliveryDate,
        isAdded: false
      };

      return {
        ...prev,
        orderDetails: newOrderDetails
      };
    });
  };

  const removeOrderDetail = (index: number) => {
    setFormData(prev => {
      // Get all added items
      const addedItems = prev.orderDetails.filter(detail => detail.isAdded);
      // Remove the item at the specified index
      const updatedAddedItems = addedItems.filter((_, i) => i !== index);
      
      return {
        ...prev,
        orderDetails: [
          // Keep the current form (first item) unchanged
          prev.orderDetails[0],
          // Add back the remaining added items
          ...updatedAddedItems
        ]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate emails before submission
    const billingEmailValid = validateEmail(formData.billingEmail);
    const shippingEmailValid = validateEmail(formData.shippingEmail);

    if (!billingEmailValid || !shippingEmailValid) {
      setEmailError({
        billing: billingEmailValid ? undefined : 'Please enter a valid email address (e.g., example@domain.com)',
        shipping: shippingEmailValid ? undefined : 'Please enter a valid email address (e.g., example@domain.com)'
      });
      return;
    }

    // Check if at least one phone number is provided for each section
    const billingHasPhone = formData.billingPhones.some(phone => phone.type);
    const shippingHasPhone = formData.shippingPhones.some(phone => phone.type);
    
    if (!billingHasPhone || !shippingHasPhone) {
      setPhoneTypeError({
        billing: billingHasPhone ? undefined : ['Please provide at least one phone number (Cell or Home)'],
        shipping: shippingHasPhone ? undefined : ['Please provide at least one phone number (Cell or Home)']
      });
      return;
    }

    // Validate phone numbers if type is selected
    const billingErrors: string[] = [];
    const shippingErrors: string[] = [];

    formData.billingPhones.forEach((phone, index) => {
      if (phone.type) {
        const completeNumber = `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
        if (completeNumber.length > 0 && completeNumber.length !== 10) {
          billingErrors[index] = 'Please enter a complete 10-digit phone number';
        }
      }
    });

    formData.shippingPhones.forEach((phone, index) => {
      if (phone.type) {
        const completeNumber = `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
        if (completeNumber.length > 0 && completeNumber.length !== 10) {
          shippingErrors[index] = 'Please enter a complete 10-digit phone number';
        }
      }
    });

    if (billingErrors.length > 0 || shippingErrors.length > 0) {
      setPhoneError({
        billing: billingErrors.length > 0 ? billingErrors : undefined,
        shipping: shippingErrors.length > 0 ? shippingErrors : undefined
      });
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Order submitted successfully!');
  };

  const renderPhoneInputs = (type: 'billing' | 'shipping') => {
    const phones = formData[`${type}Phones` as keyof OrderForm] as PhoneNumber[];
    return (
      <div className="form-group">
        <label htmlFor={`${type}Phone`}>Phone Numbers</label>
        {phones.map((phone, index) => (
          <div key={index} className="phone-input-container">
            <select 
              className="phone-type"
              value={phone.type}
              onChange={(e) => handlePhoneTypeChange(type, index, e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="cell">Cell</option>
              <option value="home">Home</option>
            </select>
            <select className="country-code" disabled>
              <option value="+1">+1</option>
            </select>
            <div className="phone-parts">
              <input
                type="text"
                id={`${type}AreaCode${index}`}
                name={`${type}AreaCode${index}`}
                value={phone.areaCode}
                onChange={(e) => handlePhoneChange(e, type, index, 'areaCode')}
                placeholder="555"
                maxLength={3}
                className="phone-part"
                disabled={!phone.type}
              />
              <span className="phone-separator">-</span>
              <input
                type="text"
                id={`${type}Prefix${index}`}
                name={`${type}Prefix${index}`}
                value={phone.prefix}
                onChange={(e) => handlePhoneChange(e, type, index, 'prefix')}
                placeholder="555"
                maxLength={3}
                className="phone-part"
                disabled={!phone.type}
              />
              <span className="phone-separator">-</span>
              <input
                type="text"
                id={`${type}LineNumber${index}`}
                name={`${type}LineNumber${index}`}
                value={phone.lineNumber}
                onChange={(e) => handlePhoneChange(e, type, index, 'lineNumber')}
                placeholder="5555"
                maxLength={4}
                className="phone-part"
                disabled={!phone.type}
              />
            </div>
            <div className="phone-actions">
              {index > 0 && (
                <button
                  type="button"
                  className="remove-phone"
                  onClick={() => removePhoneNumber(type, index)}
                >
                  Remove
                </button>
              )}
              {index === phones.length - 1 && (
                <button
                  type="button"
                  className="add-phone"
                  onClick={() => addPhoneNumber(type)}
                >
                  +
                </button>
              )}
            </div>
          </div>
        ))}
        {phoneError[type]?.map((error, index) => 
          error && <span key={index} className="error-message">{error}</span>
        )}
        {phoneTypeError[type]?.map((error, index) => 
          error && <span key={index} className="error-message">{error}</span>
        )}
      </div>
    );
  };

  const handlePackageNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      orderDetails: prev.orderDetails.map((detail, i) => 
        i === 0 && isPackageType(detail) ? {
          ...detail,
          packageName: value
        } : detail
      )
    }));
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <img src="/images/logo.png" alt="Carolina Furniture Concepts Logo" className="logo" />
          <h1>Carolina Furniture Concepts</h1>
          <p className="subtitle">Order Form</p>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-section">
            <h2>Store Selection</h2>
            <div className="form-group">
              <label htmlFor="selectedStore">Select Store *</label>
              <select
                id="selectedStore"
                name="selectedStore"
                value={formData.selectedStore}
                onChange={handleChange}
                required
              >
                <option value="">Select a Store</option>
                <option value="Arden, NC">Arden, NC</option>
                <option value="Waynesville, NC">Waynesville, NC</option>
              </select>
            </div>
            
            {formData.selectedStore && (
              <div className="store-details">
                <p><strong>Address:</strong> {storeDetails[formData.selectedStore as keyof typeof storeDetails].address}</p>
                <p><strong>Phone:</strong> {storeDetails[formData.selectedStore as keyof typeof storeDetails].phone}</p>
                <p><strong>Fax:</strong> {storeDetails[formData.selectedStore as keyof typeof storeDetails].fax}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="salespersonName">Salesperson Name *</label>
              <input
                type="text"
                id="salespersonName"
                name="salespersonName"
                value={formData.salespersonName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Billing Information</h2>
            <div className="form-group">
              <label htmlFor="billingName">Full Name *</label>
              <input
                type="text"
                id="billingName"
                name="billingName"
                value={formData.billingName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billingAddress">Street Address *</label>
              <input
                type="text"
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingCity">City *</label>
                <input
                  type="text"
                  id="billingCity"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="billingState">State *</label>
                <input
                  type="text"
                  id="billingState"
                  name="billingState"
                  value={formData.billingState}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="billingZipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="billingZipCode"
                  name="billingZipCode"
                  value={formData.billingZipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {renderPhoneInputs('billing')}

            <div className="form-group">
              <label htmlFor="billingEmail">Email *</label>
              <input
                type="email"
                id="billingEmail"
                name="billingEmail"
                value={formData.billingEmail}
                onChange={handleChange}
                required
                placeholder="example@domain.com"
              />
              {emailError.billing && <span className="error-message">{emailError.billing}</span>}
            </div>
          </div>

          {/* Delivery & Shipping Information Section */}
          <div className="form-section">
            <h2>Delivery & Shipping Information</h2>
            <div className="form-group">
              <label htmlFor="deliveryType">Delivery Type</label>
              <select
                id="deliveryType"
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleChange}
                required
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {/* Shipping Information - Only shown if delivery type is 'delivery' */}
            {formData.deliveryType === 'delivery' && (
              <>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sameAsBilling"
                      onChange={handleChange}
                    />
                    Same as billing information
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="shippingName">Full Name *</label>
                  <input
                    type="text"
                    id="shippingName"
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    required
                    disabled={formData.shippingName === formData.billingName}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shippingAddress">Street Address *</label>
                  <input
                    type="text"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    disabled={formData.shippingAddress === formData.billingAddress}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="shippingCity">City *</label>
                    <input
                      type="text"
                      id="shippingCity"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      required
                      disabled={formData.shippingCity === formData.billingCity}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingState">State *</label>
                    <input
                      type="text"
                      id="shippingState"
                      name="shippingState"
                      value={formData.shippingState}
                      onChange={handleChange}
                      required
                      disabled={formData.shippingState === formData.billingState}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingZipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="shippingZipCode"
                      name="shippingZipCode"
                      value={formData.shippingZipCode}
                      onChange={handleChange}
                      required
                      disabled={formData.shippingZipCode === formData.billingZipCode}
                    />
                  </div>
                </div>

                {renderPhoneInputs('shipping')}

                <div className="form-group">
                  <label htmlFor="shippingEmail">Email *</label>
                  <input
                    type="email"
                    id="shippingEmail"
                    name="shippingEmail"
                    value={formData.shippingEmail}
                    onChange={handleChange}
                    required
                    placeholder="example@domain.com"
                    disabled={formData.shippingEmail === formData.billingEmail}
                  />
                  {emailError.shipping && <span className="error-message">{emailError.shipping}</span>}
                </div>
              </>
            )}
          </div>

          {/* Order Summary Table */}
          <div className="form-section">
            <h2>Order Summary</h2>
            <div className="table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Loc</th>
                    <th>Qty</th>
                    <th>Ven</th>
                    <th>SKU</th>
                    <th>Grade</th>
                    <th>Cover</th>
                    <th>Desc</th>
                    <th>Sale Price</th>
                    <th>Extended Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.orderDetails.filter(detail => detail.isAdded).map((detail, index) => (
                    <React.Fragment key={detail.id}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{detail.type === 'package' ? 'Package' : 'Item'}</td>
                        <td>{detail.type === 'package' ? detail.packageName : '-'}</td>
                        <td>{detail.type === 'package' ? '' : detail.location}</td>
                        <td>{detail.type === 'package' ? '' : detail.quantity}</td>
                        <td>{detail.vendor}</td>
                        <td>{detail.sku}</td>
                        <td>{detail.grade}</td>
                        <td>{detail.cover}</td>
                        <td>{detail.description}</td>
                        <td>${detail.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${detail.extendedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>
                          <button
                            type="button"
                            className="remove-row"
                            onClick={() => removeOrderDetail(index)}
                            title="Remove row"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                      {detail.type === 'package' && detail.packageItems?.map((item, itemIndex) => (
                        <tr key={`${detail.id}-${item.id}`} className="package-item-row">
                          <td></td>
                          <td>Package Item</td>
                          <td></td>
                          <td>{item.location}</td>
                          <td>{item.quantity}</td>
                          <td>{item.vendor}</td>
                          <td>{item.sku}</td>
                          <td>{item.grade}</td>
                          <td>{item.cover}</td>
                          <td>{item.description}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'right' }}>Total:</td>
                    <td>${formData.orderDetails
                      .filter(detail => detail.isAdded)
                      .reduce((sum, detail) => sum + detail.salePrice, 0)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${formData.orderDetails
                      .filter(detail => detail.isAdded)
                      .reduce((sum, detail) => sum + detail.extendedPrice, 0)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="form-section">
            <h2>Order Details</h2>
            <div className="order-detail-container">
              <div className="order-detail-header">
                <h3>{formData.orderDetails[0].type === 'package' ? 'New Package' : 'New Item'}</h3>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.orderDetails[0].type === 'package'}
                    onChange={handlePackageModeToggle}
                  />
                  Package Mode
                </label>
              </div>
              
              {formData.orderDetails[0].type === 'package' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="package-name">Package Name</label>
                      <input
                        type="text"
                        id="package-name"
                        value={isPackageType(formData.orderDetails[0]) ? formData.orderDetails[0].packageName : ''}
                        onChange={(e) => handlePackageNameChange(e.target.value)}
                        maxLength={20}
                        required
                        placeholder="Enter package name (max 20 characters)"
                        style={{ width: '20ch', minWidth: '20ch', maxWidth: '20ch' }}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="package-sale-price">Sale Price</label>
                      <input
                        type="number"
                        id="package-sale-price"
                        value={formData.orderDetails[0].salePrice}
                        onChange={(e) => handleOrderDetailChange(0, 'salePrice', parseFloat(e.target.value))}
                        min="0"
                        step="1.00"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="package-extended-price">Extended Price</label>
                      <input
                        type="number"
                        id="package-extended-price"
                        value={formData.orderDetails[0].extendedPrice}
                        onChange={(e) => handleOrderDetailChange(0, 'extendedPrice', parseFloat(e.target.value))}
                        min="0"
                        step="1.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="package-items">
                    <h4>Package Items</h4>
                    {formData.orderDetails[0].packageItems?.map((item, index) => (
                      <div key={item.id} className="package-item">
                        <div className="package-item-header">
                          <h5>Item {index + 1}</h5>
                          <button
                            type="button"
                            className="remove-package-item"
                            onClick={() => removePackageItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor={`package-location-${item.id}`}>Loc</label>
                            <select
                              id={`package-location-${item.id}`}
                              value={item.location}
                              onChange={(e) => handlePackageItemChange(item.id, 'location', e.target.value)}
                              required
                              className="location-select"
                            >
                              <option value="S1">S1</option>
                              <option value="S2">S2</option>
                              <option value="999">999</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor={`package-quantity-${item.id}`}>Qty</label>
                            <input
                              type="number"
                              id={`package-quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => handlePackageItemChange(item.id, 'quantity', parseInt(e.target.value))}
                              min="1"
                              required
                              className="quantity-input"
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor={`package-vendor-${item.id}`}>Ven</label>
                            <input
                              type="text"
                              id={`package-vendor-${item.id}`}
                              value={item.vendor}
                              onChange={(e) => handlePackageItemChange(item.id, 'vendor', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`package-sku-${item.id}`}>SKU</label>
                            <input
                              type="text"
                              id={`package-sku-${item.id}`}
                              value={item.sku}
                              onChange={(e) => handlePackageItemChange(item.id, 'sku', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor={`package-grade-${item.id}`}>Grade</label>
                            <input
                              type="text"
                              id={`package-grade-${item.id}`}
                              value={item.grade}
                              onChange={(e) => handlePackageItemChange(item.id, 'grade', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`package-cover-${item.id}`}>Cover</label>
                            <input
                              type="text"
                              id={`package-cover-${item.id}`}
                              value={item.cover}
                              onChange={(e) => handlePackageItemChange(item.id, 'cover', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor={`package-description-${item.id}`}>Desc</label>
                          <textarea
                            id={`package-description-${item.id}`}
                            value={item.description}
                            onChange={(e) => handlePackageItemChange(item.id, 'description', e.target.value)}
                            required
                            rows={2}
                            placeholder="Enter item description"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-package-item-button"
                      onClick={addPackageItem}
                    >
                      Add Package Item
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Loc</label>
                      <select
                        id="location"
                        value={formData.orderDetails[0].location}
                        onChange={(e) => handleOrderDetailChange(0, 'location', e.target.value)}
                        required
                        className="location-select"
                      >
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="999">999</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="quantity">Qty</label>
                      <input
                        type="number"
                        id="quantity"
                        value={formData.orderDetails[0].quantity}
                        onChange={(e) => handleOrderDetailChange(0, 'quantity', parseInt(e.target.value))}
                        min="1"
                        required
                        className="quantity-input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="vendor">Ven</label>
                      <input
                        type="text"
                        id="vendor"
                        value={formData.orderDetails[0].vendor}
                        onChange={(e) => handleOrderDetailChange(0, 'vendor', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="sku">SKU</label>
                      <input
                        type="text"
                        id="sku"
                        value={formData.orderDetails[0].sku}
                        onChange={(e) => handleOrderDetailChange(0, 'sku', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="grade">Grade</label>
                      <input
                        type="text"
                        id="grade"
                        value={formData.orderDetails[0].grade}
                        onChange={(e) => handleOrderDetailChange(0, 'grade', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cover">Cover</label>
                      <input
                        type="text"
                        id="cover"
                        value={formData.orderDetails[0].cover}
                        onChange={(e) => handleOrderDetailChange(0, 'cover', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Desc</label>
                    <textarea
                      id="description"
                      value={formData.orderDetails[0].description}
                      onChange={(e) => handleOrderDetailChange(0, 'description', e.target.value)}
                      required
                      rows={3}
                      placeholder="Enter item description"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="salePrice">Sale Price</label>
                      <input
                        type="number"
                        id="salePrice"
                        value={formData.orderDetails[0].salePrice}
                        onChange={(e) => handleOrderDetailChange(0, 'salePrice', parseFloat(e.target.value))}
                        min="0"
                        step="1.00"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="extendedPrice">Extended Price</label>
                      <input
                        type="number"
                        id="extendedPrice"
                        value={formData.orderDetails[0].extendedPrice}
                        onChange={(e) => handleOrderDetailChange(0, 'extendedPrice', parseFloat(e.target.value))}
                        min="0"
                        step="1.00"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              className="add-order-button"
              onClick={addOrderDetail}
            >
              Add Item
            </button>
          </div>

          {/* Delivery Date Section */}
          <div className="form-section">
            <h2>Delivery Date</h2>
            <div className="form-group">
              <label htmlFor="deliveryDate">Delivery Date *</label>
              <input
                type="date"
                id="deliveryDate"
                value={formData.orderDetails[0].deliveryDate}
                onChange={(e) => handleOrderDetailChange(0, 'deliveryDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">Submit Order</button>
            <button type="button" className="print-button" onClick={() => window.print()}>Print Order</button>
          </div>
        </form>

        {/* Printable Version */}
        <div className="printable-version">
          <div className="print-header">
            <img src="/images/logo.png" alt="Carolina Furniture Concepts Logo" className="print-logo" />
            <h1>Carolina Furniture Concepts</h1>
            <p className="print-subtitle">Order Form</p>
          </div>

          <div className="print-store-details">
            <h2>Store Information</h2>
            {formData.selectedStore && (
              <>
                <p><strong>Store:</strong> {formData.selectedStore}</p>
                <p><strong>Address:</strong> {storeDetails[formData.selectedStore as keyof typeof storeDetails].address}</p>
                <p><strong>Phone:</strong> {storeDetails[formData.selectedStore as keyof typeof storeDetails].phone}</p>
                <p><strong>Fax:</strong> {storeDetails[formData.selectedStore as keyof typeof storeDetails].fax}</p>
              </>
            )}
          </div>

          <div className="print-contact-info">
            <div className="print-billing-info">
              <h2>Billing Information</h2>
              <p><strong>Name:</strong> {formData.billingName}</p>
              <p><strong>Address:</strong> {formData.billingAddress}</p>
              <p><strong>City:</strong> {formData.billingCity}</p>
              <p><strong>State:</strong> {formData.billingState}</p>
              <p><strong>ZIP Code:</strong> {formData.billingZipCode}</p>
              <p><strong>Email:</strong> {formData.billingEmail}</p>
              <p><strong>Phone:</strong> {formData.billingPhones.map(phone => 
                phone.type ? `${phone.type}: ${phone.areaCode}-${phone.prefix}-${phone.lineNumber}` : ''
              ).filter(Boolean).join(', ')}</p>
            </div>

            <div className="print-salesperson">
              <h2>Salesperson</h2>
              <p><strong>Name:</strong> {formData.salespersonName}</p>
            </div>

            {formData.deliveryType === 'delivery' && (
              <div className="print-shipping-info">
                <h2>Shipping Information</h2>
                <p><strong>Name:</strong> {formData.shippingName}</p>
                <p><strong>Address:</strong> {formData.shippingAddress}</p>
                <p><strong>City:</strong> {formData.shippingCity}</p>
                <p><strong>State:</strong> {formData.shippingState}</p>
                <p><strong>ZIP Code:</strong> {formData.shippingZipCode}</p>
                <p><strong>Email:</strong> {formData.shippingEmail}</p>
                <p><strong>Phone:</strong> {formData.shippingPhones.map(phone => 
                  phone.type ? `${phone.type}: ${phone.areaCode}-${phone.prefix}-${phone.lineNumber}` : ''
                ).filter(Boolean).join(', ')}</p>
              </div>
            )}
          </div>

          <div className="print-order-summary">
            <h2>Order Summary</h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Loc</th>
                  <th>Qty</th>
                  <th>Ven</th>
                  <th>SKU</th>
                  <th>Grade</th>
                  <th>Cover</th>
                  <th>Desc</th>
                  <th>Sale Price</th>
                  <th>Extended Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.orderDetails.filter(detail => detail.isAdded).map((detail, index) => (
                  <React.Fragment key={detail.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{detail.type === 'package' ? 'Package' : 'Item'}</td>
                      <td>{detail.type === 'package' ? detail.packageName : '-'}</td>
                      <td>{detail.type === 'package' ? '' : detail.location}</td>
                      <td>{detail.type === 'package' ? '' : detail.quantity}</td>
                      <td>{detail.vendor}</td>
                      <td>{detail.sku}</td>
                      <td>{detail.grade}</td>
                      <td>{detail.cover}</td>
                      <td>{detail.description}</td>
                      <td>${detail.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>${detail.extendedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    {detail.type === 'package' && detail.packageItems?.map((item, itemIndex) => (
                      <tr key={`${detail.id}-${item.id}`} className="package-item-row">
                        <td></td>
                        <td>Package Item</td>
                        <td></td>
                        <td>{item.location}</td>
                        <td>{item.quantity}</td>
                        <td>{item.vendor}</td>
                        <td>{item.sku}</td>
                        <td>{item.grade}</td>
                        <td>{item.cover}</td>
                        <td>{item.description}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={9} style={{ textAlign: 'right' }}>Total:</td>
                  <td>${formData.orderDetails
                    .filter(detail => detail.isAdded)
                    .reduce((sum, detail) => sum + detail.salePrice, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${formData.orderDetails
                    .filter(detail => detail.isAdded)
                    .reduce((sum, detail) => sum + detail.extendedPrice, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="print-delivery-info">
            <h2>Delivery Information</h2>
            <p><strong>Delivery Type:</strong> {formData.deliveryType}</p>
            <p><strong>Delivery Date:</strong> {formData.orderDetails[0].deliveryDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
