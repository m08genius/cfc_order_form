import React from 'react';
import { StoreMap } from '../types';

interface StoreDetailsProps {
  selectedStore: string;
  storeDetails: StoreMap;
}

export const StoreDetails: React.FC<StoreDetailsProps> = ({
  selectedStore,
  storeDetails
}) => {
  if (!selectedStore) return null;

  const details = storeDetails[selectedStore];

  return (
    <div className="store-details">
      <p><strong>Address:</strong> {details.address}</p>
      <p><strong>Phone:</strong> {details.phone}</p>
      <p><strong>Fax:</strong> {details.fax}</p>
    </div>
  );
}; 