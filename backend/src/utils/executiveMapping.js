// This is a mock function to map category to executive flat
export const getExecutiveFlatByCategory = (category) => {
    const mapping = {
      plumbing: 'PCS',
      electrical: 'PCS',
      housekeeping: 'PCS',
      // Add more mappings as necessary
    };
    return mapping[category];
  };
  