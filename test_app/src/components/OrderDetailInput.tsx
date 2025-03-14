import React from 'react';
import { OrderDetail, isPackageType, PackageType } from '../types';

interface OrderDetailInputProps {
  detail: OrderDetail;
  onDetailChange: (field: keyof (OrderDetail & PackageType), value: string | number) => void;
  onPackageModeToggle: () => void;
  onAddDetail: () => void;
}

export const OrderDetailInput: React.FC<OrderDetailInputProps> = ({
  detail,
  onDetailChange,
  onPackageModeToggle,
  onAddDetail
}) => {
  const handleNumberChange = (field: keyof OrderDetail, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onDetailChange(field, numValue);
    }
  };

  return (
    <div className="order-detail-input">
      <div className="detail-header">
        <h3>Add {detail.type === 'package' ? 'Package' : 'Item'}</h3>
        <button
          type="button"
          className="toggle-mode"
          onClick={onPackageModeToggle}
        >
          Switch to {detail.type === 'package' ? 'Item' : 'Package'} Mode
        </button>
      </div>

      {detail.type === 'package' && (
        <div className="form-group">
          <label htmlFor="packageName">Package Name:</label>
          <input
            type="text"
            id="packageName"
            value={isPackageType(detail) ? detail.packageName : ''}
            onChange={(e) => onDetailChange('packageName' as keyof (OrderDetail & PackageType), e.target.value)}
            required
          />
        </div>
      )}

      <div className="detail-grid">
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            value={detail.location}
            onChange={(e) => onDetailChange('location', e.target.value as 'S1' | 'S2' | '999')}
            required
          >
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="999">999</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={detail.quantity}
            onChange={(e) => onDetailChange('quantity', parseInt(e.target.value, 10))}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vendor">Vendor:</label>
          <input
            type="text"
            id="vendor"
            value={detail.vendor}
            onChange={(e) => onDetailChange('vendor', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU:</label>
          <input
            type="text"
            id="sku"
            value={detail.sku}
            onChange={(e) => onDetailChange('sku', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade:</label>
          <input
            type="text"
            id="grade"
            value={detail.grade}
            onChange={(e) => onDetailChange('grade', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cover">Cover:</label>
          <input
            type="text"
            id="cover"
            value={detail.cover}
            onChange={(e) => onDetailChange('cover', e.target.value)}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={detail.description}
            onChange={(e) => onDetailChange('description', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="salePrice">Sale Price:</label>
          <input
            type="number"
            id="salePrice"
            value={detail.salePrice}
            onChange={(e) => handleNumberChange('salePrice', e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="extendedPrice">Extended Price:</label>
          <input
            type="number"
            id="extendedPrice"
            value={detail.extendedPrice}
            onChange={(e) => handleNumberChange('extendedPrice', e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryDate">Delivery Date:</label>
          <input
            type="date"
            id="deliveryDate"
            value={detail.deliveryDate}
            onChange={(e) => onDetailChange('deliveryDate', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="detail-actions">
        <button
          type="button"
          className="add-detail"
          onClick={onAddDetail}
        >
          Add to Order
        </button>
      </div>
    </div>
  );
};