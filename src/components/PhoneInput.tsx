import React from 'react';
import { PhoneNumber } from '../types';

interface PhoneInputProps {
  type: 'billing' | 'shipping';
  index: number;
  phone: PhoneNumber;
  isLast: boolean;
  disabled?: boolean;
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

export const PhoneInput: React.FC<PhoneInputProps> = ({
  type,
  index,
  phone,
  isLast,
  disabled = false,
  onPhoneChange,
  onPhoneTypeChange,
  onAddPhone,
  onRemovePhone
}) => {
  return (
    <div className="phone-input-container">
      <select 
        className="phone-type"
        value={phone.type}
        onChange={(e) => onPhoneTypeChange(type, index, e.target.value)}
        disabled={disabled}
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
          onChange={(e) => onPhoneChange(e, type, index, 'areaCode')}
          placeholder="555"
          maxLength={3}
          className="phone-part"
          disabled={!phone.type || disabled}
        />
        <span className="phone-separator">-</span>
        <input
          type="text"
          id={`${type}Prefix${index}`}
          name={`${type}Prefix${index}`}
          value={phone.prefix}
          onChange={(e) => onPhoneChange(e, type, index, 'prefix')}
          placeholder="555"
          maxLength={3}
          className="phone-part"
          disabled={!phone.type || disabled}
        />
        <span className="phone-separator">-</span>
        <input
          type="text"
          id={`${type}LineNumber${index}`}
          name={`${type}LineNumber${index}`}
          value={phone.lineNumber}
          onChange={(e) => onPhoneChange(e, type, index, 'lineNumber')}
          placeholder="5555"
          maxLength={4}
          className="phone-part"
          disabled={!phone.type || disabled}
        />
      </div>
      
      <div className="phone-actions">
        {index > 0 && (
          <button
            type="button"
            className="remove-phone"
            onClick={() => onRemovePhone(type, index)}
            disabled={disabled}
          >
            Remove
          </button>
        )}
        {isLast && (
          <button
            type="button"
            className="add-phone"
            onClick={() => onAddPhone(type)}
            disabled={disabled}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}; 