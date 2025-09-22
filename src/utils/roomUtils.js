// roomUtils.js
// Utility functions for handling room-specific logic, like status lights and filter clearing.

import greenLight from '../assets/images/greenlight.png';
import yellowLight from '../assets/images/yellowlight.png';
import redLight from '../assets/images/redlight.png';

// Returns the light color image based on room status.
export const getStatusLight = (status) => {
  switch (status) {
    case 'available': return greenLight;
    case 'occupied': return yellowLight;
    case 'maintenance': return redLight;
    default: return null;
  }
};

// Utility function to clear all filters by setting each filter state to true.
export const clearAllFilters = (setters) => {
  setters.forEach(setter => setter(true));
};