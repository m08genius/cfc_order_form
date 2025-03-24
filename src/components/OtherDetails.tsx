import React from 'react';

interface OtherDetailsProps {
  deliveryDate: string;
  carePlan: 'yes' | 'no';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const OtherDetails: React.FC<OtherDetailsProps> = ({
  deliveryDate,
  carePlan,
  onInputChange
}) => {
  return (
    <div className="other-details">
      <h2>Other Details</h2>
      
      <div className="form-group">
        <label htmlFor="deliveryDate">Delivery Date:</label>
        <input
          type="date"
          id="deliveryDate"
          name="deliveryDate"
          value={deliveryDate}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="carePlan">5 Year Comprehensive Care Plan:</label>
        <select
          id="carePlan"
          name="carePlan"
          value={carePlan}
          onChange={onInputChange}
          required
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
    </div>
  );
}; 