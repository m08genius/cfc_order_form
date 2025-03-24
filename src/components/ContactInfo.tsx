import React from 'react';
import { PhoneNumber, PhoneErrors, EmailErrors } from '../types';
import { PhoneInput } from './PhoneInput';

interface ContactInfoProps {
  type: 'billing' | 'shipping';
  data: {
    name: string;
    email: string;
    phones: PhoneNumber[];
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  disabled?: boolean;
  phoneError?: string[];
  phoneTypeError?: string[];
  emailError?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'billing' | 'shipping',
    index: number,
    part: 'areaCode' | 'prefix' | 'lineNumber'
  ) => void;
  onPhoneTypeChange: (type: 'billing' | 'shipping', index: number, value: string) => void;
  onAddPhone: (type: 'billing' | 'shipping') => void;
  onRemovePhone: (type: 'billing' | 'shipping', index: number) => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  type,
  data,
  disabled = false,
  phoneError,
  phoneTypeError,
  emailError,
  onInputChange,
  onPhoneChange,
  onPhoneTypeChange,
  onAddPhone,
  onRemovePhone
}) => {
  const titleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className={`${type}-info contact-info`}>
      <h2>{titleCase(type)} Information</h2>
      
      <div className="form-group">
        <label htmlFor={`${type}Name`}>Name:</label>
        <input
          type="text"
          id={`${type}Name`}
          name={`${type}Name`}
          value={data.name}
          onChange={onInputChange}
          disabled={disabled}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${type}Email`}>Email:</label>
        <input
          type="email"
          id={`${type}Email`}
          name={`${type}Email`}
          value={data.email}
          onChange={onInputChange}
          disabled={disabled}
          required
        />
        {emailError && <div className="error-message">{emailError}</div>}
      </div>

      <div className="form-group phones-group">
        <label>Phone Numbers:</label>
        {data.phones.map((phone, index) => (
          <div key={index} className="phone-input-wrapper">
            <PhoneInput
              type={type}
              index={index}
              phone={phone}
              isLast={index === data.phones.length - 1}
              disabled={disabled}
              onPhoneChange={onPhoneChange}
              onPhoneTypeChange={onPhoneTypeChange}
              onAddPhone={onAddPhone}
              onRemovePhone={onRemovePhone}
            />
            {phoneError?.[index] && (
              <div className="error-message">{phoneError[index]}</div>
            )}
            {phoneTypeError?.[index] && (
              <div className="error-message">{phoneTypeError[index]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="form-group">
        <label htmlFor={`${type}Address`}>Address:</label>
        <input
          type="text"
          id={`${type}Address`}
          name={`${type}Address`}
          value={data.address}
          onChange={onInputChange}
          disabled={disabled}
          required
        />
      </div>

      <div className="address-group">
        <div className="form-group">
          <label htmlFor={`${type}City`}>City:</label>
          <input
            type="text"
            id={`${type}City`}
            name={`${type}City`}
            value={data.city}
            onChange={onInputChange}
            disabled={disabled}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${type}State`}>State:</label>
          <input
            type="text"
            id={`${type}State`}
            name={`${type}State`}
            value={data.state}
            onChange={onInputChange}
            disabled={disabled}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${type}ZipCode`}>ZIP Code:</label>
          <input
            type="text"
            id={`${type}ZipCode`}
            name={`${type}ZipCode`}
            value={data.zipCode}
            onChange={onInputChange}
            disabled={disabled}
            required
          />
        </div>
      </div>
    </div>
  );
}; 