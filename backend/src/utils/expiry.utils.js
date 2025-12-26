/**
 * Calculate days left until expiry
 */
export const calculateExpiryDays = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Determine discount based on expiry days
 */
export const calculateDiscount = (expiryDays) => {
  if (expiryDays <= 7) return 70;
  if (expiryDays <= 15) return 50;
  if (expiryDays <= 30) return 30;
  return 0;
};
