import React from 'react';
import { OrderDetail, isPackageType } from '../types';

interface OrderTableProps {
  orderDetails: OrderDetail[];
  onRemoveOrderDetail?: (index: number) => void;
  showActions?: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orderDetails,
  onRemoveOrderDetail,
  showActions = true
}) => {
  const addedItems = orderDetails.filter(detail => detail.isAdded);
  
  const calculateTotal = (field: 'salePrice' | 'extendedPrice'): number => {
    return addedItems.reduce((sum, detail) => sum + detail[field], 0);
  };

  return (
    <table className={showActions ? 'order-table' : 'print-table'}>
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
          {showActions && <th></th>}
        </tr>
      </thead>
      <tbody>
        {addedItems.map((detail, index) => (
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
              {showActions && (
                <td>
                  <button
                    type="button"
                    className="remove-row"
                    onClick={() => onRemoveOrderDetail?.(index)}
                    title="Remove row"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
            {isPackageType(detail) && detail.packageItems?.map((item, itemIndex) => (
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
                {showActions && <td></td>}
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={9} style={{ textAlign: 'right' }}>Total:</td>
          <td>${calculateTotal('salePrice').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>${calculateTotal('extendedPrice').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          {showActions && <td></td>}
        </tr>
      </tfoot>
    </table>
  );
}; 